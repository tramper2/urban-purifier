import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ClickTileDto, BuildDto } from './dto/click-tile.dto';
import { BuildingType, TileState } from '@prisma/client';

interface Position {
  x: number;
  y: number;
}

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createGame(dto: CreateGameDto) {
    const user = dto.userId
      ? await this.prisma.user.findUnique({ where: { id: dto.userId } })
      : await this.createGuestUser();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const session = await this.prisma.gameSession.create({
      data: {
        userId: user.id,
        width: dto.width,
        height: dto.height,
        pollutantCount: dto.pollutantCount,
      },
    });

    await this.generateMap(session.id, dto.width, dto.height, dto.pollutantCount);

    const tiles = await this.prisma.tile.findMany({
      where: { sessionId: session.id },
    });

    return {
      sessionId: session.id,
      userId: user.id,
      width: dto.width,
      height: dto.height,
      tiles: tiles.map(t => ({
        id: t.id,
        x: t.x,
        y: t.y,
        state: t.state,
        adjacentCount: t.adjacentCount,
      })),
    };
  }

  async clickTile(dto: ClickTileDto) {
    const tile = await this.prisma.tile.findUnique({
      where: {
        sessionId_x_y: {
          sessionId: dto.sessionId,
          x: dto.x,
          y: dto.y,
        },
      },
      include: { session: true },
    });

    if (!tile) {
      throw new NotFoundException('Tile not found');
    }

    if (tile.state === TileState.CLEANSED) {
      return { updatedTiles: [], hitPollutant: false, alreadyRevealed: true };
    }

    if (tile.isPollutant) {
      await this.prisma.tile.update({
        where: { id: tile.id },
        data: { state: TileState.CLEANSED, revealedAt: new Date() },
      });

      await this.handlePollutantHit(tile.session.userId);

      return {
        updatedTiles: [{ x: tile.x, y: tile.y, state: TileState.CLEANSED, isPollutant: true }],
        hitPollutant: true,
      };
    }

    const cleansedTiles = await this.floodFill(dto.sessionId, dto.x, dto.y);

    return {
      updatedTiles: cleansedTiles,
      hitPollutant: false,
    };
  }

  async build(dto: BuildDto) {
    const tile = await this.prisma.tile.findUnique({
      where: {
        sessionId_x_y: {
          sessionId: dto.sessionId,
          x: dto.x,
          y: dto.y,
        },
      },
      include: { session: true },
    });

    if (!tile) {
      throw new NotFoundException('Tile not found');
    }

    if (tile.state !== TileState.CLEANSED) {
      throw new BadRequestException('Can only build on cleansed tiles');
    }

    if (tile.buildingId) {
      throw new BadRequestException('Building already exists on this tile');
    }

    const building = await this.prisma.building.create({
      data: {
        userId: tile.session.userId,
        tileId: tile.id,
        type: dto.buildingType as BuildingType,
      },
    });

    await this.prisma.tile.update({
      where: { id: tile.id },
      data: { buildingId: building.id, state: TileState.BUILDING },
    });

    return building;
  }

  async getGameState(sessionId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        tiles: {
          include: { building: true },
        },
        user: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    return {
      sessionId: session.id,
      userId: session.userId,
      energy: session.user.totalEnergy,
      hp: session.user.hp,
      width: session.width,
      height: session.height,
      tiles: session.tiles.map(t => ({
        id: t.id,
        x: t.x,
        y: t.y,
        state: t.state,
        adjacentCount: t.adjacentCount,
        building: t.building
          ? {
              id: t.building.id,
              type: t.building.type,
              level: t.building.level,
            }
          : null,
      })),
    };
  }

  private async createGuestUser() {
    return this.prisma.user.create({
      data: {
        provider: 'guest',
        username: `guest_${Date.now()}`,
      },
    });
  }

  private async generateMap(sessionId: string, width: number, height: number, pollutantCount: number) {
    const pollutantPositions = this.placePollutants(width, height, pollutantCount);

    const tiles = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isPollutant = pollutantPositions.some(p => p.x === x && p.y === y);
        const adjacentCount = isPollutant
          ? 0
          : this.countAdjacentPollutants(pollutantPositions, x, y, width, height);

        tiles.push({
          sessionId,
          x,
          y,
          isPollutant,
          adjacentCount,
          state: TileState.POLLUTED,
        });
      }
    }

    return this.prisma.tile.createMany({
      data: tiles,
    });
  }

  private placePollutants(width: number, height: number, count: number): Position[] {
    const positions: Position[] = [];
    const used = new Set<string>();

    while (positions.length < count) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const key = `${x},${y}`;

      if (!used.has(key)) {
        used.add(key);
        positions.push({ x, y });
      }
    }

    return positions;
  }

  private countAdjacentPollutants(positions: Position[], x: number, y: number, width: number, height: number): number {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    let count = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (positions.some(p => p.x === nx && p.y === ny)) {
          count++;
        }
      }
    }

    return count;
  }

  private async floodFill(sessionId: string, startX: number, startY: number): Promise<any[]> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const visited = new Set<string>();
    const toProcess: Position[] = [{ x: startX, y: startY }];
    const updatedTiles: any[] = [];

    while (toProcess.length > 0) {
      const { x, y } = toProcess.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const tile = await this.prisma.tile.findUnique({
        where: {
          sessionId_x_y: {
            sessionId,
            x,
            y,
          },
        },
      });

      if (!tile || tile.isPollutant || tile.state === TileState.CLEANSED) {
        continue;
      }

      await this.prisma.tile.update({
        where: { id: tile.id },
        data: { state: TileState.CLEANSED, revealedAt: new Date() },
      });

      updatedTiles.push({
        x: tile.x,
        y: tile.y,
        state: TileState.CLEANSED,
        adjacentCount: tile.adjacentCount,
      });

      if (tile.adjacentCount === 0) {
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1],
        ];

        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < session.width && ny >= 0 && ny < session.height) {
            const newKey = `${nx},${ny}`;
            if (!visited.has(newKey)) {
              toProcess.push({ x: nx, y: ny });
            }
          }
        }
      }
    }

    return updatedTiles;
  }

  private async handlePollutantHit(userId: string) {
    const damage = 20;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hp: { decrement: damage },
      },
    });
  }
}

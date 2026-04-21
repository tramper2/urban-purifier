import * as Phaser from 'phaser';
import { TILE_COLORS, TILE_SIZE } from '../assets/images/tile_placeholder';
import { gameApi } from './api';

export class GameScene extends Phaser.Scene {
  private tiles: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private tileStates: Map<string, 'POLLUTED' | 'CLEANSED' | 'BUILDING'> = new Map();
  private gridWidth: number = 20;
  private gridHeight: number = 15;
  private sessionId: string | null = null;
  private tileSize: number = TILE_SIZE;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private selectedTile: { x: number; y: number } | null = null;
  private selectionHighlight: Phaser.GameObjects.Rectangle | null = null;
  private onTileClickCallback: ((x: number, y: number, state: string) => void) | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.calculateOffsets();
    this.createPlaceholderGraphics();
    this.createWelcomeText();
  }

  private createWelcomeText() {
    const welcomeText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50,
      '클릭 "새 게임 시작"을 눌러 시작하세요',
      {
        fontSize: '28px',
        color: '#00ff88',
        fontStyle: 'bold',
        wordWrap: { width: 600 },
        align: 'center',
      }
    );
    welcomeText.setOrigin(0.5);
  }

  async initGame(sessionId: string, width: number, height: number) {
    this.sessionId = sessionId;
    this.gridWidth = width;
    this.gridHeight = height;
    this.calculateOffsets();

    // Clear welcome text and existing tiles
    this.children.list.forEach(child => {
      if (child.type === 'Text') {
        child.destroy();
      }
    });

    this.tiles.forEach((tile) => tile.destroy());
    this.tiles.clear();
    this.tileStates.clear();

    if (this.selectionHighlight) {
      this.selectionHighlight.destroy();
      this.selectionHighlight = null;
    }
    this.selectedTile = null;

    this.renderGrid();
  }

  private calculateOffsets() {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    this.offsetX = Math.floor((screenWidth - this.gridWidth * this.tileSize) / 2);
    this.offsetY = Math.floor((screenHeight - this.gridHeight * this.tileSize) / 2);
  }

  private createPlaceholderGraphics() {
    // Create background
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x1a1a2e
    );
  }

  private renderGrid() {
    // Create grid
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const tileX = this.offsetX + x * this.tileSize + this.tileSize / 2;
        const tileY = this.offsetY + y * this.tileSize + this.tileSize / 2;

        const tile = this.add.rectangle(
          tileX,
          tileY,
          this.tileSize - 2,
          this.tileSize - 2,
          TILE_COLORS.POLLUTED
        );
        tile.setStrokeStyle(2, 0x333333);

        const key = `${x},${y}`;
        this.tiles.set(key, tile);
        this.tileStates.set(key, 'POLLUTED');

        tile.setInteractive();

        // 클로저 문제 해결을 위한 즉시 실행 함수
        ((tileX: number, tileY: number, tileKey: string, tileObj: Phaser.GameObjects.Rectangle) => {
          tileObj.on('pointerdown', async () => {
            await this.handleTileClick(tileX, tileY);
          });

          tileObj.on('pointerover', () => {
            const state = this.tileStates.get(tileKey);
            if (state === 'POLLUTED') {
              // 오염된 타일: 빨간색 하이라이트
              tileObj.setFillStyle(0xff0000);
            } else if (state === 'CLEANSED') {
              // 정화된 타일: 파란색 하이라이트
              tileObj.setFillStyle(0x0099ff);
            }
          });

          tileObj.on('pointerout', () => {
            const state = this.tileStates.get(tileKey);
            if (state === 'POLLUTED') {
              tileObj.setFillStyle(TILE_COLORS.POLLUTED);
            } else if (state === 'CLEANSED') {
              tileObj.setFillStyle(TILE_COLORS.CLEANSED);
            } else if (state === 'BUILDING') {
              tileObj.setFillStyle(TILE_COLORS.BUILDING);
            }
          });
        })(x, y, key, tile);
      }
    }
  }

  private async handleTileClick(x: number, y: number) {
    if (!this.sessionId) {
      console.error('No session ID');
      return;
    }

    const key = `${x},${y}`;
    const state = this.tileStates.get(key);

    // 정화된 타일 클릭 시 건물 메뉴 오픈
    if (state === 'CLEANSED') {
      this.selectTile(x, y);
      if (this.onTileClickCallback) {
        this.onTileClickCallback(x, y, 'CLEANSED');
      }
      return;
    }

    // 오염된 타일은 정화 시도
    try {
      const result = await gameApi.clickTile(this.sessionId, x, y);

      result.updatedTiles.forEach((updatedTile) => {
        const tileKey = `${updatedTile.x},${updatedTile.y}`;
        const tile = this.tiles.get(tileKey);
        if (tile) {
          const color = updatedTile.state === 'CLEANSED' ? TILE_COLORS.CLEANSED : TILE_COLORS.POLLUTED;
          tile.setFillStyle(color);
          tile.setStrokeStyle(2, updatedTile.state === 'CLEANSED' ? 0x27ae60 : 0x333333);

          this.tileStates.set(tileKey, updatedTile.state as 'POLLUTED' | 'CLEANSED');

          // Remove old text if exists
          const oldText = this.children.getByName(`text-${tileKey}`);
          if (oldText) {
            oldText.destroy();
          }

          // Show adjacent count if greater than 0
          if (updatedTile.adjacentCount > 0) {
            const text = this.add.text(
              tile.x,
              tile.y,
              updatedTile.adjacentCount.toString(),
              {
                fontSize: '24px',
                color: '#00ff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4,
              }
            );
            text.setOrigin(0.5);
            text.setDepth(1);
            text.setName(`text-${tileKey}`);
          }
        }
      });

      if (result.hitPollutant) {
        // Flash red effect
        this.cameras.main.flash(200, 255, 0, 0);
      }
    } catch (error) {
      console.error('Error clicking tile:', error);
    }
  }

  selectTile(x: number, y: number) {
    const key = `${x},${y}`;
    const tileState = this.tileStates.get(key);
    const tile = this.tiles.get(key);

    if (!tile || tileState !== 'CLEANSED') {
      return;
    }

    // Remove previous highlight
    if (this.selectionHighlight) {
      this.selectionHighlight.destroy();
    }

    const tileX = this.offsetX + x * this.tileSize + this.tileSize / 2;
    const tileY = this.offsetY + y * this.tileSize + this.tileSize / 2;

    // Create new highlight
    this.selectionHighlight = this.add.rectangle(
      tileX,
      tileY,
      this.tileSize + 4,
      this.tileSize + 4,
      0xffff00
    );
    this.selectionHighlight.setStrokeStyle(3, 0xffff00);
    this.selectionHighlight.setDepth(0);

    this.selectedTile = { x, y };
  }

  clearSelection() {
    if (this.selectionHighlight) {
      this.selectionHighlight.destroy();
      this.selectionHighlight = null;
    }
    this.selectedTile = null;
  }

  getSelectedTile(): { x: number; y: number } | null {
    return this.selectedTile;
  }

  setTileClickCallback(callback: (x: number, y: number, state: string) => void) {
    this.onTileClickCallback = callback;
  }

  async buildOnSelectedTile(buildingType: string) {
    if (!this.selectedTile || !this.sessionId) {
      return false;
    }

    try {
      await gameApi.build(
        this.sessionId,
        this.selectedTile.x,
        this.selectedTile.y,
        buildingType
      );

      // Update tile appearance
      const key = `${this.selectedTile.x},${this.selectedTile.y}`;
      const tile = this.tiles.get(key);
      if (tile) {
        tile.setFillStyle(TILE_COLORS.BUILDING);
        tile.setStrokeStyle(3, 0xffff00);
        this.tileStates.set(key, 'BUILDING');

        // Add building icon
        const icon = this.add.text(
          tile.x,
          tile.y,
          this.getBuildingIcon(buildingType),
          {
            fontSize: '32px',
          }
        );
        icon.setOrigin(0.5);
        icon.setDepth(2);
      }

      // Clear selection
      this.clearSelection();

      return true;
    } catch (error) {
      console.error('Error building:', error);
      return false;
    }
  }

  private getBuildingIcon(type: string): string {
    switch (type) {
      case 'RESIDENTIAL': return '🏠';
      case 'POWER_PLANT': return '⚡';
      case 'RADAR': return '📡';
      case 'PURIFIER_TOWER': return '🔮';
      default: return '🏗️';
    }
  }

  updateTile(x: number, y: number, state: string) {
    const key = `${x},${y}`;
    const tile = this.tiles.get(key);
    if (tile) {
      const color = state === 'CLEANSED' ? TILE_COLORS.CLEANSED : TILE_COLORS.POLLUTED;
      tile.setFillStyle(color);
      tile.setStrokeStyle(2, state === 'CLEANSED' ? 0x27ae60 : 0x333333);
    }
  }
}

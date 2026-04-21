import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ClickTileDto, BuildDto } from './dto/click-tile.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Post('click')
  async clickTile(@Body() clickTileDto: ClickTileDto) {
    return this.gameService.clickTile(clickTileDto);
  }

  @Post('build')
  async build(@Body() buildDto: BuildDto) {
    return this.gameService.build(buildDto);
  }

  @Get('state/:sessionId')
  async getGameState(@Param('sessionId') sessionId: string) {
    return this.gameService.getGameState(sessionId);
  }
}

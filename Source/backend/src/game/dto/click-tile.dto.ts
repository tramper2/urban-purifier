import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ClickTileDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsInt()
  x: number;

  @IsInt()
  y: number;
}

export class BuildDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsInt()
  x: number;

  @IsInt()
  y: number;

  @IsString()
  @IsNotEmpty()
  buildingType: string;
}

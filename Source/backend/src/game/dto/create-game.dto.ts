import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateGameDto {
  @IsInt()
  @Min(5)
  @Max(50)
  width: number;

  @IsInt()
  @Min(5)
  @Max(50)
  height: number;

  @IsInt()
  @Min(1)
  @Max(500)
  pollutantCount: number;

  @IsOptional()
  userId?: string;
}

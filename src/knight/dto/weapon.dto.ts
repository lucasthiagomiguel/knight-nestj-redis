import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class WeaponDto {
  @ApiProperty({ description: 'Nome da arma' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Modificador da arma' })
  @IsNumber()
  mod: number;

  @ApiProperty({ description: 'Atributo da arma' })
  @IsString()
  attr: string;

  @ApiProperty({ description: 'Se a arma está equipada ou não' })
  @IsBoolean()
  equipped: boolean;
}

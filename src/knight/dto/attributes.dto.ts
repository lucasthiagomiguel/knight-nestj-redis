import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AttributesDto {
  @ApiProperty({ description: 'Força' })
  @IsNumber()
  strength: number;

  @ApiProperty({ description: 'Destreza' })
  @IsNumber()
  dexterity: number;

  @ApiProperty({ description: 'Constituição' })
  @IsNumber()
  constitution: number;

  @ApiProperty({ description: 'Inteligência' })
  @IsNumber()
  intelligence: number;

  @ApiProperty({ description: 'Sabedoria' })
  @IsNumber()
  wisdom: number;

  @ApiProperty({ description: 'Carisma' })
  @IsNumber()
  charisma: number;
}

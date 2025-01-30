import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';
import { WeaponDto } from './weapon.dto';
import { AttributesDto } from './attributes.dto';

export class CreateKnightDto {
  @ApiProperty({ description: 'ID do knight', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Nome do knight' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Apelido do knight' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'Data de nascimento', example: '1995-08-25' })
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiProperty({
    description: 'Lista de armas do knight',
    type: [WeaponDto],
  })
  @IsArray()
  @IsOptional()
  weapons?: WeaponDto[];

  @ApiProperty({
    description: 'Atributos do knight',
    type: AttributesDto,
  })
  @IsObject()
  attributes: AttributesDto;

  @ApiProperty({ description: 'Atributo chave do knight' })
  @IsString()
  keyAttribute: string;
}

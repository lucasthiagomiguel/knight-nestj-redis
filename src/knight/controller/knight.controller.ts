import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { KnightsService } from '../service/knight.service';
import { Knight } from '../entity/knight.entity';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { UpdateKnightDto } from '../dto/update-knight.dto';

@ApiTags('knights')
@Controller('knights')
export class KnightsController {
  constructor(private readonly knightsService: KnightsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os knights com filtro opcional' })
  async findAll(
    @Query('filter') filter?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ knights: Knight[]; total: number; totalPages: number }> {
    return this.knightsService.findAll(filter, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um knight pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do knight', required: true })
  async findOne(@Param('id') id: string): Promise<Knight> {
    return this.knightsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo knight' })
  @ApiBody({ description: 'Dados do novo knight', type: CreateKnightDto })
  async create(@Body() knightDto: CreateKnightDto): Promise<Knight> {
    return this.knightsService.create(knightDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza o apelido de um knight' })
  @ApiParam({ name: 'id', description: 'ID do knight', required: true })
  @ApiBody({ description: 'Novo apelido', type: UpdateKnightDto })
  async update(@Param('id') id: string, @Body() knightDto: UpdateKnightDto) {
    return this.knightsService.updateNickname(id, knightDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Marca um knight como herói, sem removê-lo do banco',
  })
  @ApiParam({ name: 'id', description: 'ID do knight', required: true })
  async remove(@Param('id') id: string): Promise<void> {
    return this.knightsService.remove(id);
  }
}

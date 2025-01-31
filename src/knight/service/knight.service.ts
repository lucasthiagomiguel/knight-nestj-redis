import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Knight } from '../entity/knight.entity';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { UpdateKnightDto } from '../dto/update-knight.dto';
import { calculateAttack, calculateExperience } from '../utils/knight-utils';

@Injectable()
export class KnightsService {
  constructor(
    @InjectModel(Knight.name) private knightModel: Model<Knight>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(
    filter?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ knights: Knight[]; total: number; totalPages: number }> {
    const cacheKey = `knights:filter=${filter}:page=${page}:size=${pageSize}`;
    const cachedData = await this.cacheManager.get<{
      knights: Knight[];
      total: number;
      totalPages: number;
    }>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const skip = (page - 1) * pageSize;
    const total = await this.knightModel.countDocuments().exec();
    const totalPages = Math.ceil(total / pageSize);

    const knights = await this.knightModel
      .find()
      .skip(skip)
      .limit(pageSize)
      .exec();

    let result = { knights, total, totalPages };
    if (filter === 'heroes') {
      const SOME_THRESHOLD = 50;
      result = {
        knights: knights.filter(
          (knight) =>
            knight.attack !== undefined && knight.attack > SOME_THRESHOLD,
        ),
        total,
        totalPages,
      };
    }

    await this.cacheManager.set(cacheKey, result, 60 * 1000); // Cache por 60 segundos
    return result;
  }

  async findOne(id: string): Promise<Knight> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    const cacheKey = `knight:${id}`;
    const cachedKnight = await this.cacheManager.get<Knight>(cacheKey);
    if (cachedKnight) {
      return cachedKnight;
    }

    const knight = await this.knightModel.findById(id).exec();
    if (!knight) {
      throw new NotFoundException(`Knight com ID ${id} não encontrado`);
    }

    await this.cacheManager.set(cacheKey, knight, 60 * 1000);
    return knight;
  }

  async create(knightDto: CreateKnightDto): Promise<Knight> {
    if (!knightDto.attributes[knightDto.keyAttribute]) {
      throw new BadRequestException('Atributo-chave inválido');
    }

    // Verifica se já existe um cavaleiro com o mesmo nickname
    const knightExists = await this.knightModel
      .exists({ nickname: knightDto.nickname })
      .exec();
    if (knightExists) {
      throw new BadRequestException('Já existe um cavaleiro com esse nickname');
    }

    const birthday = knightDto.birthday
      ? new Date(knightDto.birthday)
      : undefined;
    const knight = new this.knightModel({
      ...knightDto,
      birthday,
      weapons:
        knightDto.weapons?.map((w) => ({
          name: w.name,
          mod: w.mod,
          attr: w.attr,
          equipped: w.equipped,
        })) || [],
      attack: calculateAttack(knightDto),
      exp: birthday ? calculateExperience(birthday) : 0,
      isHero: false,
    });

    await this.cacheManager.del('knights:*'); // Limpa cache de listagem
    return knight.save();
  }

  async updateNickname(
    id: string,
    updateKnightDto: UpdateKnightDto,
  ): Promise<Knight> {
    const knight = await this.knightModel.findById(id).exec();
    if (!knight) {
      throw new NotFoundException('Knight not found');
    }
    const knightExists = await this.knightModel
      .exists({ nickname: updateKnightDto.nickname })
      .exec();
    if (knightExists) {
      throw new BadRequestException('Já existe um cavaleiro com esse nickname');
    }
    if (updateKnightDto.nickname) {
      knight.nickname = updateKnightDto.nickname;
      await knight.save();
      await this.cacheManager.del(`knight:${id}`); // Remove do cache
      return knight;
    }

    throw new BadRequestException('Nickname is required');
  }

  async remove(id: string): Promise<void> {
    const knight = await this.findOne(id);
    knight.isHero = true;
    await knight.save();

    await this.cacheManager.del(`knight:${id}`); // Remove do cache individual
    await this.cacheManager.del('knights:*'); // Remove cache da listagem
  }
}

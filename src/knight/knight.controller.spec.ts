import { Test, TestingModule } from '@nestjs/testing';
import { KnightsService } from './service/knight.service';
import { getModelToken } from '@nestjs/mongoose';
import { Knight } from './entity/knight.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateKnightDto } from './dto/update-knight.dto';

describe('KnightsService', () => {
  let service: KnightsService;
  let knightModel: any; // Mock do Model do Mongoose
  let cacheManager: any; // Mock do cacheManager

  beforeEach(async () => {
    // Criação do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnightsService,
        {
          provide: getModelToken(Knight.name), // Mock do Model
          useValue: {
            findById: jest.fn(),
            exists: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER, // Mock do cacheManager
          useValue: {
            del: jest.fn(),
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KnightsService>(KnightsService);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    knightModel = module.get(getModelToken(Knight.name));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should update the nickname of a knight', async () => {
    const knightId = '1';
    const updateKnightDto: UpdateKnightDto = { nickname: 'newNickname' };

    // Mockando o retorno do findById com exec() funcionando
    const mockKnight = {
      id: knightId,
      nickname: 'oldNickname',
      save: jest.fn().mockResolvedValue(true),
      exec: jest.fn().mockResolvedValue({ nickname: 'oldNickname' }), // Mock do exec
    };

    // Mockando findById
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    knightModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockKnight), // Mock de exec() aqui
    });

    // Mockando o comportamento de exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    knightModel.exists.mockResolvedValue(false); // Mock para verificar se o nickname já existe no banco

    // Mockando o comportamento do cacheManager
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    cacheManager.del.mockResolvedValue(true);

    // Chamando a função
    const updatedKnight = await service.updateNickname(
      knightId,
      updateKnightDto,
    );

    // Verificando o resultado esperado
    expect(updatedKnight.nickname).toBe('newNickname');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(knightModel.findById).toHaveBeenCalledWith(knightId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(knightModel.exists).toHaveBeenCalledWith({
      nickname: updateKnightDto.nickname,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(knightModel.save).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(cacheManager.del).toHaveBeenCalledWith(`knight:${knightId}`);
  });

  it('should throw NotFoundException if knight not found', async () => {
    const knightId = '1';
    const updateKnightDto: UpdateKnightDto = { nickname: 'newNickname' };

    // Mock para simular que o cavaleiro não foi encontrado
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    knightModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null), // Mock de exec() retornando null
    });

    await expect(
      service.updateNickname(knightId, updateKnightDto),
    ).rejects.toThrow(new NotFoundException('Knight not found'));
  });

  it('should throw BadRequestException if the nickname already exists', async () => {
    const knightId = '1';
    const updateKnightDto: UpdateKnightDto = { nickname: 'newNickname' };

    // Mock para simular que já existe um cavaleiro com o mesmo nickname
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    knightModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        id: knightId,
        nickname: 'oldNickname',
        save: jest.fn(),
      }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    knightModel.exists.mockResolvedValue(true); // Simulando que o nickname já existe

    await expect(
      service.updateNickname(knightId, updateKnightDto),
    ).rejects.toThrow(
      new BadRequestException('Já existe um cavaleiro com esse nickname'),
    );
  });

  it('should throw BadRequestException if nickname is not provided', async () => {
    const knightId = '1';
    const updateKnightDto: UpdateKnightDto = { nickname: '' };

    await expect(
      service.updateNickname(knightId, updateKnightDto),
    ).rejects.toThrow(new BadRequestException('Nickname is required'));
  });
});

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(), // Para usar variáveis de ambiente
    CacheModule.register({
      store: redisStore, // Usa o Redis como storage
      host: 'localhost', // Host do Redis
      port: 6379, // Porta padrão do Redis
      ttl: 600000, // Tempo de expiração do cache (10 minutos)
    }),
  ],
  exports: [CacheModule], // Exporta para uso em outros módulos
})
export class RedisCacheModule {}

import { CacheModule } from '@nestjs/cache-manager';
import { Module, Global } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Global() // <-- Isso torna o módulo disponível globalmente
@Module({
  imports: [
    CacheModule.register({
      store: redisStore, // Usa o Redis como storage
      host: 'localhost',
      port: 6379,
      ttl: 600000, // Tempo de expiração do cache (10 minutos)
    }),
  ],
  exports: [CacheModule], // Exporta para que outros módulos possam usá-lo
})
export class RedisCacheModule {}

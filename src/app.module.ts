import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { RedisCacheModule } from './cache/cache.module';
import { KnightsModule } from './knight/knight.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RedisCacheModule, // Agora global
    KnightsModule, // Adicionando o módulo novamente
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightsService } from './service/knight.service';
import { KnightsController } from './controller/knight.controller';
import { Knight, KnightSchema } from './entity/knight.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Knight.name, schema: KnightSchema }]),
  ],
  providers: [KnightsService],
  controllers: [KnightsController],
})
export class KnightsModule {}

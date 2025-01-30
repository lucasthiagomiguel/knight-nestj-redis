import { PartialType } from '@nestjs/mapped-types';
import { CreateKnightDto } from './create-knight.dto';
export class UpdateKnightDto extends PartialType(CreateKnightDto) {
  birthday?: Date;
}

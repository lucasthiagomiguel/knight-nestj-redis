import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Weapon extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mod: number;

  @Prop({ required: true })
  attr: string;

  @Prop({ required: true })
  equipped: boolean;
}

export const WeaponSchema = SchemaFactory.createForClass(Weapon);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Weapon, WeaponSchema } from './weapon.entity';
import { Attributes, AttributesSchema } from './attributes.entity';

@Schema()
export class Knight extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ type: [WeaponSchema], required: true })
  weapons: Weapon[];

  @Prop({ type: AttributesSchema, required: true })
  attributes: Attributes;

  @Prop({ required: true })
  keyAttribute: string;

  @Prop()
  attack?: number;

  @Prop()
  exp?: number;

  @Prop({ default: false }) // Adicionado
  isHero: boolean; // Adicionado para corrigir o erro
}

export const KnightSchema = SchemaFactory.createForClass(Knight);

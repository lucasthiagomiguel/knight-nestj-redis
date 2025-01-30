import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attributes extends Document {
  @Prop({ required: true })
  strength: number;

  @Prop({ required: true })
  dexterity: number;

  @Prop({ required: true })
  constitution: number;

  @Prop({ required: true })
  intelligence: number;

  @Prop({ required: true })
  wisdom: number;

  @Prop({ required: true })
  charisma: number;
}

export const AttributesSchema = SchemaFactory.createForClass(Attributes);

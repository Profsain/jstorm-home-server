import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, default: 'settings' })
  type: string;

  @Prop({ required: true })
  whatsappNumber: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

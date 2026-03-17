import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, default: 'settings' })
  type: string;

  @Prop()
  whatsappNumber: string;

  @Prop({ default: '+44737015649' })
  shortletWhatsapp: string;

  @Prop({ default: '+2348141880667' })
  propertiesWhatsapp: string;

  @Prop()
  smtpHost: string;

  @Prop({ default: 587 })
  smtpPort: number;

  @Prop()
  smtpUser: string;

  @Prop()
  smtpPass: string;

  @Prop()
  smtpFrom: string;

  @Prop()
  facebookUrl: string;

  @Prop()
  instagramUrl: string;

  @Prop()
  tiktokUrl: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

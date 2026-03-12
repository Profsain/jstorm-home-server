import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Testimonial extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  text: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);

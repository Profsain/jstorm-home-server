import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PropertyType {
  AIRBNB = 'airbnb',
  SERVICED = 'serviced',
  SALE = 'sale',
  SHORTLET = 'shortlet',
  RENT = 'rent',
}

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: PropertyType, required: true })
  type: PropertyType;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: '' })
  priceLabel: string;

  @Prop({ default: 0 })
  bedrooms: number;

  @Prop({ default: 0 })
  bathrooms: number;

  @Prop({ default: 0 })
  guests: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop([String])
  amenities: string[];

  @Prop([String])
  features: string[];

  @Prop({ default: 0 })
  sqft: number;

  @Prop([String])
  images: string[];

  @Prop({ default: true })
  available: boolean;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

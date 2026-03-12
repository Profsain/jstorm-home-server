import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ required: true })
  guestName: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Property' })
  propertyId: Types.ObjectId;

  @Prop({ required: true })
  checkIn: string;

  @Prop({ required: true })
  checkOut: string;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

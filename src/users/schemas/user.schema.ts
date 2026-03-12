import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  PROPERTIES_MANAGER = 'Properties Manager',
  BOOKINGS_AGENT = 'Bookings Agent',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ enum: UserRole, default: UserRole.PROPERTIES_MANAGER })
  role: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

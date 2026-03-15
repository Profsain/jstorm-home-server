import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '../schemas/booking.schema';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}

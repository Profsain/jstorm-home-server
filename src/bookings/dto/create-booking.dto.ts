import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Name of the guest' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: '60d5ec273a5a2c2c9c8b4567', description: 'The ID of the property' })
  @IsMongoId()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: '2026-06-01', description: 'Check-in date' })
  @IsString()
  @IsNotEmpty()
  checkIn: string;

  @ApiProperty({ example: '2026-06-07', description: 'Check-out date' })
  @IsString()
  @IsNotEmpty()
  checkOut: string;
}

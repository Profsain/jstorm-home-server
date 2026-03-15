import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Name of the guest' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Email of the guest' })
  @IsString()
  @IsNotEmpty()
  guestEmail: string;

  @ApiProperty({ example: '+44 7911 123456', description: 'Phone number of the guest' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

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

  @ApiProperty({ example: 'Late check-in please', description: 'Special requests' })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}

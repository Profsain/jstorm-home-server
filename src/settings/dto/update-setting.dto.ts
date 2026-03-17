import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: '+2348000000000' })
  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @ApiProperty({ example: '+44737015649' })
  @IsString()
  @IsNotEmpty()
  shortletWhatsapp: string;

  @ApiProperty({ example: '+2348141880667' })
  @IsString()
  @IsNotEmpty()
  propertiesWhatsapp: string;

  @ApiProperty({ example: 'smtp.gmail.com' })
  @IsString()
  @IsOptional()
  smtpHost?: string;

  @ApiProperty({ example: 587 })
  @IsOptional()
  smtpPort?: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsOptional()
  smtpUser?: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsOptional()
  smtpPass?: string;

  @ApiProperty({ example: 'noreply@example.com' })
  @IsString()
  @IsOptional()
  smtpFrom?: string;

  @ApiProperty({ example: 'https://facebook.com/jstormhomes' })
  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @ApiProperty({ example: 'https://instagram.com/jstormhomes' })
  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @ApiProperty({ example: 'https://tiktok.com/@jstormhomes' })
  @IsString()
  @IsOptional()
  tiktokUrl?: string;
}

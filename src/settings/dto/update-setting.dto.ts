import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: '+2348000000000' })
  @IsString()
  whatsappNumber?: string;

  @ApiProperty({ example: '+44737015649' })
  @IsString()
  @IsNotEmpty()
  shortletWhatsapp: string;

  @ApiProperty({ example: '+2348141880667' })
  @IsString()
  @IsNotEmpty()
  propertiesWhatsapp: string;
}

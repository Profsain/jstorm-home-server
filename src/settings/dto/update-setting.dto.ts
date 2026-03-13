import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: '+2348000000000' })
  @IsString()
  @IsNotEmpty()
  whatsappNumber: string;
}

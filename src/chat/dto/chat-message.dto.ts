import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'The user message to the AI assistant' })
  @IsString()
  @MinLength(1)
  message: string;
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to the AI chat assistant' })
  async chat(@Body() dto: ChatMessageDto): Promise<{ reply: string }> {
    const reply = await this.chatService.getReply(dto.message);
    return { reply };
  }
}

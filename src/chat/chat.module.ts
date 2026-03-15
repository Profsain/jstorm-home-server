import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PropertiesModule } from '../properties/properties.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [PropertiesModule, SettingsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

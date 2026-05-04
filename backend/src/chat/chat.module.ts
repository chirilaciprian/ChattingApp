import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConversationModule, MessageModule, AuthModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }

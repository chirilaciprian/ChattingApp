import { Injectable } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { CreateConversationDto } from 'src/conversation/dto/create-conversation.dto';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantService } from 'src/participant/participant.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly participantService: ParticipantService,
  ) { }

  async createConversation(
    conversation: CreateConversationDto,
  ): Promise<Conversation> {
    const newConversation = await this.conversationService.create({
      participantIds: conversation.participantIds,
      isGroup: conversation.isGroup,
      name: conversation.name,
      createdBy: conversation.createdBy,
    });
    return this.conversationService.findOne(newConversation.id);
  }

  async deleteConversation(conversationId: string): Promise<Conversation> {
    return await this.conversationService.remove(conversationId);
  }

  async saveMessage(message: CreateMessageDto): Promise<Message> {
    return await this.messageService.create(message);
  }

  async updateUserStatus(userId: string, isOnline: boolean): Promise<User> {
    return await this.userService.updateStatus(userId, isOnline);
  }

  async incrementUnreadCount(id: string): Promise<Participant> {
    return await this.participantService.incrementUnreadCount(id);
  }

  async resetUnreadCount(conversationId: string, userId: string): Promise<void> {
    const participants = await this.getConversationParticipants(conversationId);
    const participant = participants.find(p => p.user.id === userId);
    if (participant) {
      await this.participantService.resetUnreadCount(participant.id);
    }
  }

  async getConversationParticipants(conversationId: string): Promise<Participant[]> {
    const conversation = await this.conversationService.findOne(conversationId);
    return conversation.participants;
  }


}

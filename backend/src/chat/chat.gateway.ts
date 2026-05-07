import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ClassSerializerInterceptor,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateConversationDto } from 'src/conversation/dto/create-conversation.dto';
import { Message } from 'src/message/entities/message.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) { }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token as string)?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;
      await client.join(`user_${userId}`);
      this.logger.debug(
        `Client connected: ${client.id} to room: user_${userId}`,
      );
      const updatedUser = await this.chatService.updateUserStatus(userId, true);
      this.server.emit('userStatusChanged', {
        userId,
        isOnline: true,
        lastSeen: updatedUser.lastSeen,
      });
    } catch (error) {
      this.logger.error(
        `Connection failed for client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const token = (client.handshake.auth?.token as string)?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    const payload: JwtPayload = await this.jwtService.verifyAsync(token);
    const userId = payload.sub;
    const updatedUser = await this.chatService.updateUserStatus(userId, false);
    this.server.emit('userStatusChanged', {
      userId,
      isOnline: false,
      lastSeen: updatedUser.lastSeen,
    });
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<{ success: boolean; data?: Message; error?: string }> {
    const rooms = client.rooms;
    if (!rooms.has(message.conversationId)) {
      this.logger.warn(
        `Client ${client.id} attempted to send message to conversation ${message.conversationId} without joining it.`,
      );
      return { success: false, error: 'Unauthorized to send message to this conversation' };
    }
    this.logger.debug(`Data received in gateway: ${JSON.stringify(message)}`);
    const newMessage: Message = await this.chatService.saveMessage(message);
    this.server
      .to(message.conversationId)
      .emit('messageReceived', newMessage);
    return {
      success: true,
      data: newMessage,
    };
  }

  @SubscribeMessage('joinConversation')
  async handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await client.join(conversationId);
      this.logger.log(
        `Client ${client.id} joined conversation: ${conversationId}`,
      );
      client.emit('conversationJoined', conversationId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to join conversation: ${error.message || 'Unknown error'}`,);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      }
    }
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<{ success: boolean; error?: string; }> {
    try {
      await client.leave(conversationId);
      this.logger.log(`Client ${client.id} left conversation: ${conversationId}`);
      client.emit('conversationLeft', conversationId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to leave conversation: ${error.message || 'Unknown error'}`,);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      }
    }
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    @MessageBody() conversation: CreateConversationDto,
  ): Promise<{ success: boolean; data?: Conversation; error?: string }> {
    try {
      const newConversation =
        await this.chatService.createConversation(conversation);
      newConversation.participants.forEach((participant) => {
        this.server
          .to(`user_${participant.user.id}`)
          .emit('conversationCreated', newConversation);
      });
      return {
        success: true,
        data: newConversation,
      }
    } catch (error) {
      this.logger.error(`Failed to create conversation: ${error.message}`,);
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @SubscribeMessage('deleteConversation')
  async handleDeleteConversation(
    @MessageBody() conversationId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const deletedConversation =
        await this.chatService.deleteConversation(conversationId);
      deletedConversation.participants.forEach((participant) => {
        this.server
          .to(`user_${participant.user.id}`)
          .emit('conversationDeleted', conversationId);
      });
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete conversation: ${error.message}`,);
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

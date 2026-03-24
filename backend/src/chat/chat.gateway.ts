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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateConversationDto } from 'src/conversation/dto/create-conversation.dto';
import { Message } from 'src/message/entities/message.entity';
interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

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
    } catch (error) {
      this.logger.error(
        `Connection failed for client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const rooms = client.rooms;
    if (!rooms.has(message.conversationId)) {
      this.logger.warn(
        `Client ${client.id} attempted to send message to conversation ${message.conversationId} without joining it.`,
      );
      return;
    }
    this.logger.debug(`Data received in gateway: ${JSON.stringify(message)}`);
    const newMessage: Message = await this.chatService.saveMessage(message);
    this.server
      .to(message.conversationId)
      .emit('messageReceived', JSON.stringify(newMessage));
  }

  @SubscribeMessage('joinConversation')
  async handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(conversationId);
    this.logger.log(
      `Client ${client.id} joined conversation: ${conversationId}`,
    );
    client.emit('conversationJoined', conversationId);
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(conversationId);
    this.logger.log(`Client ${client.id} left conversation: ${conversationId}`);
    client.emit('conversationLeft', conversationId);
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    @MessageBody() conversation: CreateConversationDto,
  ): Promise<void> {
    const newConversation =
      await this.chatService.createConversation(conversation);
    newConversation.participants.forEach((participant) => {
      this.server
        .to(`user_${participant.id}`)
        .emit('conversationCreated', newConversation);
    });
  }

  @SubscribeMessage('deleteConversation')
  async handleDeleteConversation(
    @MessageBody() conversationId: string,
  ): Promise<void> {
    const deletedConversation =
      await this.chatService.deleteConversation(conversationId);
    deletedConversation.participants.forEach((participant) => {
      this.server
        .to(`user_${participant.id}`)
        .emit('conversationDeleted', conversationId);
    });
  }
}

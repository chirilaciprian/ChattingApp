import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chatMessage.dto';
import { Server, Socket } from 'socket.io';
import {
  ClassSerializerInterceptor,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    const rooms = client.rooms;
    if (!rooms.has(data.conversationId)) {
      this.logger.warn(
        `Client ${client.id} attempted to send message to conversation ${data.conversationId} without joining it.`,
      );
      return;
    }
    if (typeof data === 'string') {
      data = JSON.parse(data) as ChatMessageDto;
    }
    this.logger.debug(`Data received in gateway: ${JSON.stringify(data)}`);
    this.logger.log(`New message from client ${client.id}: ${data.message}`);
    this.server.to(data.conversationId).emit('messageReceived', data.message);
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
}

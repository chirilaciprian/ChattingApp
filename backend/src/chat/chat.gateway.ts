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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    const rooms = client.rooms;
    if (!rooms.has(data.conversationId)) {
      console.log(
        `Client ${client.id} attempted to send message to conversation ${data.conversationId} without joining it.`,
      );
      return;
    }
    if (typeof data === 'string') {
      data = JSON.parse(data) as ChatMessageDto;
    }
    console.log('Data received in gateway:', data);
    console.log('New message from client ' + client.id + ': ' + data.message);
    this.server.to(data.conversationId).emit('messageReceived', data.message);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(conversationId);
    console.log(`Client ${client.id} joined conversation: ${conversationId}`);
    client.emit('conversationJoined', conversationId);
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(conversationId);
    console.log(`Client ${client.id} left conversation: ${conversationId}`);
    client.emit('conversationLeft', conversationId);
  }
}

import { io, Socket } from 'socket.io-client';
import type { Conversation, Message } from '../types/types';
export interface CreateMessageDto {
    conversationId: string;
    content: string;
    senderId: string;
}

export interface CreateConversationDto {
    participantIds: string[];
}

type MessageHandler = (message: Message) => void;
type ConversationHandler = (conversation: Conversation) => void;
type StringHandler = (id: string) => void;

class ChatService {
    private socket: Socket | null = null;

    connect(serverUrl: string, token: string): void {
        if (this.socket?.connected) return;

        this.socket = io(serverUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        this.socket.on('connect', () => {
            console.log('[ChatService] Connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[ChatService] Disconnected:', reason);
        });

        this.socket.on('connect_error', (err) => {
            console.error('[ChatService] Connection error:', err.message);
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('[ChatService] Socket destroyed');
        }
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    joinConversation(conversationId: string): void {
        this.assertConnected();
        this.socket!.emit('joinConversation', conversationId);
    }

    leaveConversation(conversationId: string): void {
        this.assertConnected();
        this.socket!.emit('leaveConversation', conversationId);
    }

    sendMessage(message: CreateMessageDto): void {
        this.assertConnected();
        this.socket!.emit('newMessage', message);
    }

    createConversation(conversation: CreateConversationDto): void {
        this.assertConnected();
        this.socket!.emit('createConversation', conversation);
    }

    deleteConversation(conversationId: string): void {
        this.assertConnected();
        this.socket!.emit('deleteConversation', conversationId);
    }

    onMessageReceived(handler: MessageHandler): () => void {
        this.assertConnected();
        const wrapped = (raw: string | Message) => {
            const msg: Message =
                typeof raw === 'string' ? JSON.parse(raw) : raw;
            handler(msg);
        };
        this.socket!.on('messageReceived', wrapped);
        return () => this.socket?.off('messageReceived', wrapped);
    }

    onConversationJoined(handler: StringHandler): () => void {
        this.assertConnected();
        this.socket!.on('conversationJoined', handler);
        return () => this.socket?.off('conversationJoined', handler);
    }

    onConversationLeft(handler: StringHandler): () => void {
        this.assertConnected();
        this.socket!.on('conversationLeft', handler);
        return () => this.socket?.off('conversationLeft', handler);
    }

    onConversationCreated(handler: ConversationHandler): () => void {
        this.assertConnected();
        this.socket!.on('conversationCreated', handler);
        return () => this.socket?.off('conversationCreated', handler);
    }

    onConversationDeleted(handler: StringHandler): () => void {
        this.assertConnected();
        this.socket!.on('conversationDeleted', handler);
        return () => this.socket?.off('conversationDeleted', handler);
    }

    private assertConnected(): void {
        if (!this.socket?.connected) {
            throw new Error('[ChatService] Socket is not connected. Call connect() first.');
        }
    }
}

export type { ChatService };

export const chatService = new ChatService();
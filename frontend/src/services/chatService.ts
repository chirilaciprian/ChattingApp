import { io, Socket } from 'socket.io-client'
import type { Conversation, CreateMessageDto, Message, CreateConversationDto } from '../types/types'

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

let socket: Socket | null = null;

type SocketResponse<T = undefined> = {
    success: boolean;
    data?: T;
    error?: string;
}

type SocketEventCallbacks = {
    onMessageReceived?: (message: Message) => void;
    onConversationCreated?: (conversation: Conversation) => void;
    onConversationDeleted?: (conversationId: string) => void;
    onConversationJoined?: (conversationId: string) => void;
    onUserStatusChanged?: (payload: { userId: string; isOnline: boolean; lastSeen: Date }) => void;
    onConnectError?: (error: Error) => void;
}

export const connect = (token: string): Socket => {
    if (socket?.connected) return socket;
    socket = io(GATEWAY_URL, {
        auth: {
            token: `Bearer ${token}`
        },
        transports: ["websocket"],
    });
    return socket;
}

export const disconnect = () => {
    socket?.disconnect();
    socket = null;
}

export const isConnected = (): boolean => {
    return socket?.connected || false;
}

export const getSocket = (): Socket | null => {
    return socket;
}

// listeners

export const registerListeners = (callbacks: SocketEventCallbacks): void => {
    if (!socket) return;

    if (callbacks.onMessageReceived) {
        socket.on('messageReceived', (message: Message) => {
            callbacks.onMessageReceived!(message);
        })
    }

    if (callbacks.onConversationCreated) {
        socket.on('conversationCreated', callbacks.onConversationCreated);
    }

    if (callbacks.onConversationDeleted) {
        socket.on('conversationDeleted', callbacks.onConversationDeleted);
    }

    if (callbacks.onConversationJoined) {
        socket.on('conversationJoined', callbacks.onConversationJoined);
    }

    if (callbacks.onUserStatusChanged) {
        socket.on('userStatusChanged', callbacks.onUserStatusChanged);
    }

    if (callbacks.onConnectError) {
        socket.on('connect_error', callbacks.onConnectError);
    }
}

export const removeListeners = () => {
    socket?.removeAllListeners();
}

// emitters

export const joinConversation = (conversationId: string): Promise<SocketResponse> => {
    return new Promise((resolve) => {
        socket?.emit('joinConversation', conversationId, (res: SocketResponse) => resolve(res));
    });
}

export const leaveConversation = (conversationId: string): Promise<SocketResponse> => {
    return new Promise((resolve) => {
        socket?.emit('leaveConversation', conversationId, (res: SocketResponse) => resolve(res));
    });
}

export const sendMessage = (message: CreateMessageDto): Promise<SocketResponse> => {
    return new Promise((resolve) => {
        socket?.emit('newMessage', message, (res: SocketResponse) => resolve(res));
    });
}

export const createConversation = (dto: CreateConversationDto): Promise<SocketResponse<Conversation>> => {
    return new Promise((resolve) => {
        socket?.emit('createConversation', dto, (res: SocketResponse<Conversation>) => resolve(res));
    });
}

export const deleteConversation = (conversationId: string): Promise<SocketResponse> => {
    return new Promise((resolve) => {
        socket?.emit('deleteConversation', conversationId, (res: SocketResponse) => resolve(res));
    });
}

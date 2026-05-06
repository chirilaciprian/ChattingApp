export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  conversations: Conversation[];
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface Conversation {
  id: string;
  participants?: User[];
  name: string;
  isGroup: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  data: string;
  createdBy: User;
  conversation: Conversation;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateMessageDto {
  data: string;
  conversationId: string;
  userId: string;
}

export interface CreateConversationDto {
  participantIds: string[];
  name: string | null;
  isGroup: boolean;
}

export interface UpdateConversationDto {
  participantIds: string[];
  name?: string | null;
  isGroup: boolean;
  avatarUrl?: string | null;
}

export interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

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
  participants?: Participant[];
  name: string;
  isGroup: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  data: string;
  createdBy: Participant;
  conversation: Conversation;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateMessageDto {
  data: string;
  conversationId: string;
  participantId: string;
}

export interface CreateConversationDto {
  participantIds: string[];
  name: string | null;
  isGroup: boolean;
}

export interface UpdateConversationDto {
  name: string;
  isGroup: boolean;
  avatarUrl?: string | null;
}

export interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Participant {
  id: string;
  user: User;
  conversationId?: string;
  messages?: string[];
  role: 'admin' | 'member';
  isMuted: boolean;
  joinedAt: Date;
}

export interface CreateParticipantDto {
  userId: string;
  conversationId: string;
  role: 'admin' | 'member';
}

export interface UpdateParticipantDto {
  role?: 'admin' | 'member';
  isMuted?: boolean;
  messages?: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  conversations: Conversation[];
  createdAt: Date;
  updatedAt: Date;
};

export interface Conversation {
  id: string;
  participants?: User[];
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
}

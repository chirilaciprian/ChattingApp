export interface User {
  id: string;
  email: string;
  username: string;  
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
};

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  readStatus: boolean;
};

export interface Chat {
  id: string;
  userId: string;
  user: User;
  messages: Message[];
  lastActivity: Date;
  lastMessage?: string;
  unreadCount?: number;
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
  isRead: boolean;
  createdAt: Date;
}

export interface User {
  id: string;  
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
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

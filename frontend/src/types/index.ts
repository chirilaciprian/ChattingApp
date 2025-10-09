export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  readStatus: boolean;
};

export type Chat = {
  id: string;
  userId: string;
  user: User;
  messages: Message[];
  lastActivity: Date;
  lastMessage?: string;
  unreadCount?: number;
};

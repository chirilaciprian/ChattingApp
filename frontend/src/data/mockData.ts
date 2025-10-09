import type { User, Message, Chat } from '../types';

// Mock current user
export const currentUser: User = {
  id: '1',
  username: 'JohnDoe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  status: 'online',
};

// Mock users
export const mockUsers: User[] = [
  {
    id: '2',
    username: 'AliceSmith',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '3',
    username: 'BobJohnson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'away',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '4',
    username: 'CarolWhite',
    email: 'carol@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '5',
    username: 'DavidBrown',
    email: 'david@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'online',
    lastSeen: new Date(),
  },
];

// Mock messages for different chats
const messagesWithAlice: Message[] = [
  {
    id: 'm1',
    content: 'Hey! How are you doing?',
    senderId: '2',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    readStatus: true,
  },
  {
    id: 'm2',
    content: "I'm doing great! Working on a new project.",
    senderId: '1',
    receiverId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    readStatus: true,
  },
  {
    id: 'm3',
    content: 'That sounds exciting! What kind of project?',
    senderId: '2',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    readStatus: true,
  },
  {
    id: 'm4',
    content: "It's a chat application using React and TypeScript!",
    senderId: '1',
    receiverId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    readStatus: true,
  },
  {
    id: 'm5',
    content: 'Nice! Are you using any UI framework?',
    senderId: '2',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    readStatus: true,
  },
  {
    id: 'm6',
    content: 'Yes! Tailwind CSS with DaisyUI components.',
    senderId: '1',
    receiverId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    readStatus: false,
  },
];

const messagesWithBob: Message[] = [
  {
    id: 'm7',
    content: 'Did you see the game last night?',
    senderId: '3',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    readStatus: true,
  },
  {
    id: 'm8',
    content: 'No, I missed it. Who won?',
    senderId: '1',
    receiverId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    readStatus: true,
  },
  {
    id: 'm9',
    content: 'Our team won 3-2! It was amazing!',
    senderId: '3',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    readStatus: false,
  },
];

const messagesWithCarol: Message[] = [
  {
    id: 'm10',
    content: 'Can you help me with the documentation?',
    senderId: '4',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    readStatus: true,
  },
  {
    id: 'm11',
    content: 'Sure! What do you need help with?',
    senderId: '1',
    receiverId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 115),
    readStatus: true,
  },
];

const messagesWithDavid: Message[] = [
  {
    id: 'm12',
    content: 'Meeting at 3 PM today?',
    senderId: '5',
    receiverId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    readStatus: true,
  },
  {
    id: 'm13',
    content: 'Yes, see you there!',
    senderId: '1',
    receiverId: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    readStatus: false,
  },
];

// Mock chats
export const mockChats: Chat[] = [
  {
    id: 'chat1',
    userId: '2',
    user: mockUsers[0], // Alice
    messages: messagesWithAlice,
    lastActivity: messagesWithAlice[messagesWithAlice.length - 1].timestamp,
    lastMessage: messagesWithAlice[messagesWithAlice.length - 1].content,
    unreadCount: 1,
  },
  {
    id: 'chat2',
    userId: '3',
    user: mockUsers[1], // Bob
    messages: messagesWithBob,
    lastActivity: messagesWithBob[messagesWithBob.length - 1].timestamp,
    lastMessage: messagesWithBob[messagesWithBob.length - 1].content,
    unreadCount: 1,
  },
  {
    id: 'chat3',
    userId: '4',
    user: mockUsers[2], // Carol
    messages: messagesWithCarol,
    lastActivity: messagesWithCarol[messagesWithCarol.length - 1].timestamp,
    lastMessage: messagesWithCarol[messagesWithCarol.length - 1].content,
    unreadCount: 0,
  },
  {
    id: 'chat4',
    userId: '5',
    user: mockUsers[3], // David
    messages: messagesWithDavid,
    lastActivity: messagesWithDavid[messagesWithDavid.length - 1].timestamp,
    lastMessage: messagesWithDavid[messagesWithDavid.length - 1].content,
    unreadCount: 0,
  },
];

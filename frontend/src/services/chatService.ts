/**
 * Chat Service
 * Handles all chat-related API calls
 */

import type { Chat, Message } from '../types/types';

/**
 * Fetch all chats for current user
 * TODO: Replace with actual API call
 */
export const fetchChats = async (): Promise<Chat[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In real app, this would fetch from backend
  // For now, return empty array (mockData will be used as fallback)
  return [];
};

/**
 * Send a message
 * TODO: Replace with actual API call
 */
export const sendMessage = async (
  _chatId: string,
  content: string,
  senderId: string,
  receiverId: string
): Promise<Message> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const newMessage: Message = {
    id: `m${Date.now()}`,
    content,
    senderId,
    receiverId,
    timestamp: new Date(),
    readStatus: false,
  };
  
  // In real app, this would send to backend and return the saved message
  return newMessage;
};

/**
 * Mark messages as read
 * TODO: Replace with actual API call
 */
export const markMessagesAsRead = async (
  chatId: string,
  messageIds: string[]
): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // In real app, this would update message read status on backend
  console.log(`Marking messages as read in chat ${chatId}:`, messageIds);
};

/**
 * Fetch messages for a specific chat
 * TODO: Replace with actual API call
 */
export const fetchChatMessages = async (_chatId: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // In real app, this would fetch messages from backend
  return [];
};

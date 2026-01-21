import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockChats, currentUser } from '../data/mockData';
import { sendMessage as sendMessageService } from '../services/chatService';
import type { Chat } from '../types/types';

interface UseChatManagementReturn {
  chats: Chat[];
  selectedChatId: string | null;
  selectedChat: Chat | undefined;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  logout: () => void;
}

/**
 * Custom hook for chat management
 */
export const useChatManagement = (): UseChatManagementReturn => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const sendMessage = async (content: string) => {
    if (!selectedChat) return;

    setIsLoading(true);

    try {
      const newMessage = await sendMessageService(
        selectedChat.id,
        content,
        currentUser.id,
        selectedChat.userId
      );

      // Update local state with new message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastActivity: new Date(),
                lastMessage: content,
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Show error toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return {
    chats,
    selectedChatId,
    selectedChat,
    isLoading,
    messagesEndRef,
    selectChat,
    sendMessage,
    logout,
  };
};

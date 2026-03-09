import { useState } from 'react';
import type { Conversation } from '../types/types';
import { fetchConversationsByUserId } from '../services/conversationService';

interface UseChatManagementReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  isLoading: boolean;
  setSelectedConversation: (conversation: Conversation | undefined) => void;  
  fetchConversations: (userId: string) => Promise<void>;
}

/**
 * Custom hook for chat management
 */
export const useChat = (): UseChatManagementReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConversations = async (userId: string) => {
    const conversations = await fetchConversationsByUserId(userId);
    setConversations(conversations);
    setIsLoading(false);
  }

  return {
    conversations,
    selectedConversation,
    isLoading,    
    fetchConversations,
    setSelectedConversation,
  }
};

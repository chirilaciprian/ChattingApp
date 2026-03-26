import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { chatService, type ChatService } from '../services/chatService';

interface ChatProviderProps {
  children: ReactNode;
  serverUrl: string;
  token: string;
}

const ChatContext = createContext<ChatService | null>(null);

export const ChatProvider = ({ children, serverUrl, token }: ChatProviderProps) => {
  useEffect(() => {
    chatService.connect(serverUrl, token);

    return () => {
      chatService.disconnect();
    };
  }, [serverUrl, token]);

  return (
    <ChatContext.Provider value={chatService}>
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = (): ChatService => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
};
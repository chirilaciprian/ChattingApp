import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';
import { useAuth } from '../context/authContext';

const Chat = () => {
  const { user } = useAuth();
  // const {
  //   conversations,
  //   selectedConversation,
  //   isLoading,
  //   setSelectedConversation,
  //   fetchConversations,
  // } = useChat();

  useEffect(() => {
    console.log('Current user:', user);
  }, []);

  return (
    <>

    </>
  );
};

export default Chat;

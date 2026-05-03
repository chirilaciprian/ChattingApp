import React from 'react';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const Chat: React.FC = () => {
  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Sidebar for conversations */}
      <div className="hidden md:block">
        <ConversationList />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow />
      </div>
      
      {/* Mobile drawer could be added here if needed, 
          but for now let's keep it simple and functional */}
    </div>
  );
};

export default Chat;

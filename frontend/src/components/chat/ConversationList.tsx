import React, { useState } from 'react';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import type { Conversation } from '../../types/types';
import CreateConversationModal from './CreateConversationModal';

const ConversationList: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversation } = useChat();
  const { user } = useAuth();
  
  const [modalMode, setModalMode] = useState<'none' | 'chat' | 'group'>('none');

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.name) return conversation.name;
    if (!conversation.isGroup && conversation.participants) {
      const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
      if (otherParticipants.length > 0) return otherParticipants[0].username;
    }
    return conversation.name || 'Conversation';
  };

  return (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-300 w-80 relative">
      <div className="p-4 border-b border-base-300 flex justify-between items-center overflow-visible">
        <div className="avatar placeholder cursor-pointer" title="Profile (Coming soon)">
          <div className="bg-neutral text-neutral-content rounded-full w-10 overflow-hidden flex items-end justify-center">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full translate-y-1">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
             </svg>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button 
            className="btn btn-circle btn-ghost btn-sm tooltip tooltip-bottom" 
            data-tip="New Chat"
            onClick={() => setModalMode('chat')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 0010 18c2.31 0 4.438-.784 6.131-2.108.345-.27.535-.704.423-1.123A7.962 7.962 0 0010 10a7.962 7.962 0 00-7.954 5.253zM15 4a1 1 0 10-2 0v2h-2a1 1 0 100 2h2v2a1 1 0 102 0V8h2a1 1 0 100-2h-2V4z" />
            </svg>
          </button>
          
          <button 
            className="btn btn-circle btn-ghost btn-sm tooltip tooltip-bottom" 
            data-tip="New Group"
            onClick={() => setModalMode('group')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center opacity-50">No conversations yet</div>
        ) : (
          <ul className="menu w-full p-0">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => setActiveConversation(conv.id)}
                  className={`flex items-center gap-3 p-4 rounded-none border-b border-base-300 ${activeConversationId === conv.id ? 'active' : ''
                    }`}
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span>{getConversationName(conv).charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold truncate">{getConversationName(conv)}</div>
                    <div className="text-xs opacity-60 truncate">Click to chat</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateConversationModal 
        isOpen={modalMode !== 'none'} 
        mode={modalMode === 'none' ? 'chat' : modalMode} 
        onClose={() => setModalMode('none')} 
      />
    </div>
  );
};

export default ConversationList;

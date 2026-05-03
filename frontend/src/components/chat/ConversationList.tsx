import React from 'react';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import type { Conversation } from '../../types/types';

const ConversationList: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversation } = useChat();
  const { user } = useAuth();

  const getConversationName = (conversation: Conversation) => {
    if (!conversation.participants) return 'Conversation';
    const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
    if (otherParticipants.length === 0) return 'Me';
    return otherParticipants.map(p => p.username).join(', ');
  };

  return (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-300 w-80">
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <h2 className="text-xl font-bold">Chats</h2>
        <button className="btn btn-circle btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
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
                  className={`flex items-center gap-3 p-4 rounded-none border-b border-base-300 ${
                    activeConversationId === conv.id ? 'active' : ''
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
    </div>
  );
};

export default ConversationList;

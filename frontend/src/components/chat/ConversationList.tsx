import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUserPlus, HiUserGroup } from 'react-icons/hi2';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import type { Conversation } from '../../types/types';
import CreateConversationModal from './CreateConversationModal';

const ConversationList: React.FC = () => {
  const { conversations, activeConversation, setActiveConversation } = useChat();
  const { user } = useAuth();
  const [modalMode, setModalMode] = useState<'none' | 'chat' | 'group'>('none');

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.name) return conversation.name;
    if (!conversation.isGroup && conversation.participants) {
      const other = conversation.participants.filter(p => p.id !== user?.id);
      if (other.length > 0) return other[0].username;
    }
    return conversation.name || 'Conversation';
  };

  return (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-300 w-80 relative">
      <div className="p-4 border-b border-base-300 flex justify-between items-center overflow-visible">
        <Link to="/profile" className="avatar placeholder cursor-pointer tooltip tooltip-bottom" data-tip="Profile">
          <div className="bg-neutral text-neutral-content rounded-full w-10 overflow-hidden flex items-end justify-center">
            <span className="text-xl -translate-y-1">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
        </Link>
        <div className="flex gap-1">
          <button
            className="btn btn-circle btn-ghost btn-sm tooltip tooltip-bottom"
            data-tip="New Chat"
            onClick={() => setModalMode('chat')}
          >
            <HiUserPlus className="w-5 h-5" />
          </button>
          <button
            className="btn btn-circle btn-ghost btn-sm tooltip tooltip-bottom"
            data-tip="New Group"
            onClick={() => setModalMode('group')}
          >
            <HiUserGroup className="w-5 h-5" />
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
                  onClick={() => setActiveConversation(conv)}
                  className={`flex items-center gap-3 p-4 rounded-none border-b border-base-300 ${activeConversation?.id === conv.id ? 'active' : ''}`}
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
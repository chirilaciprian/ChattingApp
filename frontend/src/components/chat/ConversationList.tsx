import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUserPlus, HiUserGroup } from 'react-icons/hi2';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import type { Conversation } from '../../types/types';
import CreateConversationModal from './CreateConversationModal';
import Avatar from '../common/Avatar';

const ConversationList: React.FC = () => {
  const { conversations, activeConversation, setActiveConversation, unreadCounts } = useChat();
  const { user } = useAuth();
  const [modalMode, setModalMode] = useState<'none' | 'chat' | 'group'>('none');

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.name) return conversation.name;
    if (!conversation.isGroup && conversation.participants) {
      const other = conversation.participants.filter(p => p.user.id !== user?.id);
      if (other.length > 0) return other[0].user.username;
    }
    return conversation.name || 'Conversation';
  };

  return (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-300 w-80">
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <Link to="/profile" className="cursor-pointer tooltip tooltip-bottom" data-tip="Profile">
          <Avatar url={user?.avatarUrl} name={user?.username || 'U'} />
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
          <div className="flex flex-col">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`flex items-center gap-3 p-4 border-b border-base-300 hover:bg-base-300 transition-colors text-left w-full cursor-pointer ${activeConversation?.id === conv.id ? 'bg-base-300' : ''}`}
              >
                <div className="shrink-0">
                  {conv.isGroup ? (
                    <Avatar
                      isGroup
                      url={conv.avatarUrl}
                      name={getConversationName(conv)}
                      size="lg"
                      participants={conv.participants ?? []}
                      currentUserId={user?.id}
                    />
                  ) : (
                    <Avatar
                      url={conv.participants?.find(p => p.user.id !== user?.id)?.user.avatarUrl}
                      name={getConversationName(conv)}
                      size="lg"
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold truncate">{getConversationName(conv)}</span>
                  <span className="text-xs opacity-60 truncate">Click to chat</span>
                </div>
                {(unreadCounts[conv.id] ?? 0) > 0 && (
                  <span className="badge badge-primary badge-sm shrink-0">
                    {unreadCounts[conv.id] > 99 ? '99+' : unreadCounts[conv.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
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
import React, { useState, useRef, useEffect } from 'react';
import { HiChatBubbleOvalLeft, HiPaperAirplane, HiPencil } from 'react-icons/hi2';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import MessageItem from './MessageItem';
import Avatar from '../common/Avatar';

const ChatWindow: React.FC = () => {
  const { messages, sendMessage, activeConversation, messagesLoading } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || !user) return;
    const res = await sendMessage({ data: inputValue, conversationId: activeConversation.id, userId: user.id });
    if (res.success) setInputValue('');
  };

  const formatLastSeen = (date?: Date | string) => {
    if (!date) return 'Offline';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    return `Last seen ${d.toLocaleDateString()}`;
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base-100 opacity-50">
        <HiChatBubbleOvalLeft className="h-16 w-16 mb-4" />
        <p className="text-xl">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100 h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <Avatar
            url={activeConversation.isGroup ? activeConversation.avatarUrl : activeConversation.participants?.find(p => p.id !== user?.id)?.avatarUrl}
            name={activeConversation.isGroup
              ? activeConversation.name || 'Group'
              : activeConversation.participants?.find(p => p.id !== user?.id)?.username || 'Conversation'}
          />
          <div>
            <h3 className="font-bold">
              {activeConversation.isGroup
                ? activeConversation.name || 'Group'
                : activeConversation.participants?.find(p => p.id !== user?.id)?.username || 'Conversation'}
            </h3>
            {activeConversation.isGroup ? (
              <div className="text-xs opacity-50">
                {activeConversation.participants?.length ?? 0} members
              </div>
            ) : (() => {
              const other = activeConversation.participants?.find(p => p.id !== user?.id);
              return other?.isOnline
                ? <div className="text-xs text-success font-medium">Online</div>
                : <div className="text-xs opacity-50">{formatLastSeen(other?.lastSeen)}</div>;
            })()}
          </div>
        </div>

        {activeConversation.isGroup && (
          <button
            onClick={() => navigate(`/group/${activeConversation.id}`)}
            className="btn btn-ghost btn-circle"
          >
            <HiPencil className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMe = msg.createdBy.id === user?.id;
              let showAvatar = false;
              if (!isMe) {
                const prevMsg2 = messages[index - 1];
                if (!prevMsg2 || prevMsg2.createdBy.id !== msg.createdBy.id) showAvatar = true;
              }
              let showDateDivider = false;
              const prevMsg = messages[index - 1];
              if (!prevMsg) {
                showDateDivider = true;
              } else {
                const timeDiff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
                if (timeDiff > 10 * 60 * 1000) showDateDivider = true;
              }
              return (
                <MessageItem key={msg.id} message={msg} currentUser={user} showAvatar={showAvatar} showDateDivider={showDateDivider} showUsername={showAvatar} />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-base-300 bg-base-100 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-1 focus:outline-none focus:border-primary"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!inputValue.trim()}>
          <HiPaperAirplane className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
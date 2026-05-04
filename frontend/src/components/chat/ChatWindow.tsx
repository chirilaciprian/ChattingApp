import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import MessageItem from './MessageItem';

const ChatWindow: React.FC = () => {
  const { messages, sendMessage, activeConversation, messagesLoading } = useChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || !user) return;

    const res = await sendMessage({
      data: inputValue,
      conversationId: activeConversation.id,
      userId: user.id,
    });

    if (res.success) {
      setInputValue('');
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base-100 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-xl">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100 h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-100/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span>
                {activeConversation.isGroup
                  ? activeConversation.name?.charAt(0).toUpperCase() || 'G'
                  : (activeConversation.participants?.find(p => p.id !== user?.id)?.username?.charAt(0).toUpperCase() || 'C')}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold">
              {activeConversation.isGroup
                ? activeConversation.name || 'Group'
                : (activeConversation.participants?.find(p => p.id !== user?.id)?.username || 'Conversation')}
            </h3>
            <div className="text-xs text-success">Online</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-circle btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMe = msg.createdBy.id === user?.id;

              let showAvatar = false;
              if (!isMe) {
                const nextMsg = messages[index + 1];
                if (!nextMsg || nextMsg.createdBy.id !== msg.createdBy.id) {
                  showAvatar = true;
                }
              }

              let showDateDivider = false;
              const prevMsg = messages[index - 1];
              if (!prevMsg) {
                showDateDivider = true;
              } else {
                const timeDiff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
                if (timeDiff > 10 * 60 * 1000) { // 10 minutes
                  showDateDivider = true;
                }
              }

              return (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUser={user}
                  showAvatar={showAvatar}
                  showDateDivider={showDateDivider}
                />
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

import React from 'react';
import type { Message, User } from '../../types/types';

interface MessageItemProps {
  message: Message;
  currentUser: User | null;
  showAvatar?: boolean;
  showDateDivider?: boolean;
  showUsername?: boolean;
}

const formatDividerDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
                  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return timeStr;
  }
  
  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays < 7) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]} ${timeStr}`;
  }
  
  const isThisYear = date.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }
  
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}, ${timeStr}`;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUser, showAvatar = true, showDateDivider = true }) => {
  const isMe = message.createdBy.id === currentUser?.id;
  const messageTime = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {showDateDivider && (
        <div className="flex justify-center w-full mt-6 mb-2">
          <span className="text-xs text-base-content/50 font-medium">
            {formatDividerDate(message.createdAt)}
          </span>
        </div>
      )}
      <div className={`chat group ${isMe ? 'chat-end' : 'chat-start'}`}>
        {!isMe && (
          <div className="chat-image avatar">
            {showAvatar ? (
              <div className="w-10 rounded-full bg-base-300 text-base-content/50 overflow-hidden flex items-end justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full translate-y-1">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-10"></div>
            )}
          </div>
        )}
        
        {/* Hover timestamp effect on top */}
        <div className="chat-header opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] h-0 overflow-visible text-base-content/50 select-none cursor-default">
          <span className="relative -top-4">{messageTime}</span>
        </div>
        
        <div className={`chat-bubble ${isMe ? 'bg-neutral text-neutral-content' : 'bg-base-200 text-base-content'}`}>
          {message.data}
        </div>
      </div>
    </>
  );
};

export default MessageItem;

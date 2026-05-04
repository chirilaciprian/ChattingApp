import React from 'react';
import { HiUser } from 'react-icons/hi2';
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
          <span className="text-xs text-base-content/50 font-medium">{formatDividerDate(message.createdAt)}</span>
        </div>
      )}
      <div className={`chat group ${isMe ? 'chat-end' : 'chat-start'}`}>
        {!isMe && (
          <div className="chat-image avatar">
            {showAvatar ? (
              <div className="w-10 rounded-full bg-base-300 text-base-content/50 overflow-hidden flex items-end justify-center">
                <HiUser className="w-full h-full translate-y-1" />
              </div>
            ) : (
              <div className="w-10" />
            )}
          </div>
        )}
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

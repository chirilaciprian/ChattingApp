import type { Message } from '../../types/types';
import { currentUser } from '../../data/mockData';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOwnMessage = message.senderId === currentUser.id;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-bubble">{message.content}</div>
      <div className="chat-footer opacity-50 text-xs mt-1">
        {formatTime(message.timestamp)}
        {isOwnMessage && (
          <span className="ml-1">{message.readStatus ? '✓✓' : '✓'}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

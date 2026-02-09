  import type { Chat } from '../../types/types';

  interface UserListProps {
    chats: Chat[];
    selectedChatId: string | null;
    onSelectChat: (chatId: string) => void;
  }

  const UserList = ({ chats, selectedChatId, onSelectChat }: UserListProps) => {
    const formatTime = (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getStatusColor = (status?: string) => {
      switch (status) {
        case 'online':
          return 'bg-success';
        case 'away':
          return 'bg-warning';
        default:
          return 'bg-base-300';
      }
    };

    return (
      <div className="h-full bg-base-100 border-r border-base-300">
        {/* Header */}
        <div className="p-4 border-b border-base-300">
          <h2 className="text-2xl font-bold">Messages</h2>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search conversations..."
              className="input input-bordered input-sm w-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-300 ${
                selectedChatId === chat.id ? 'bg-base-200' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with status indicator */}
                <div className="avatar online">
                  <div className="w-12 h-12 rounded-full relative">
                    <img src={chat.user.avatar} alt={chat.user.username} />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${getStatusColor(
                        chat.user.status
                      )}`}
                    ></span>
                  </div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{chat.user.username}</h3>
                    <span className="text-xs text-base-content/60">
                      {formatTime(chat.lastActivity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-base-content/70 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount! > 0 && (
                      <span className="badge badge-primary badge-sm">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default UserList;

import UserList from '../components/chat/UserList';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import { useChatManagement } from '../hooks/useChatManagement';

const ChatPage = () => {
  const {
    chats,
    selectedChatId,
    selectedChat,
    messagesEndRef,
    selectChat,
    sendMessage,
    logout,
  } = useChatManagement();

  return (
    <div className="h-screen flex">
      {/* User List Sidebar */}
      <div className="w-full md:w-96 flex-shrink-0">
        <UserList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={selectChat}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-base-200">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-base-100 border-b border-base-300 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src={selectedChat.user.avatar}
                      alt={selectedChat.user.username}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedChat.user.username}</h3>
                  <p className="text-xs text-base-content/60">
                    {selectedChat.user.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedChat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput onSendMessage={sendMessage} />
          </>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-2">Welcome to Chat App</h3>
              <p className="text-base-content/70">
                Select a conversation to start chatting
              </p>
              <button onClick={logout} className="btn btn-outline mt-4">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

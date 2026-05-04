import React, { useState, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { useChat } from '../../context/chatContext';
import { useAuth } from '../../context/authContext';
import type { User } from '../../types/types';
import { searchUserByUsername } from '../../services/userService';
import Avatar from '../common/Avatar';

interface CreateConversationModalProps {
  isOpen: boolean;
  mode: 'chat' | 'group';
  onClose: () => void;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({ isOpen, mode, onClose }) => {
  const { createConversation } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (isOpen) { setSearchQuery(''); setSearchResults([]); setSelectedUsers([]); setGroupName(''); }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      try {
        const results = await searchUserByUsername(e.target.value);
        setSearchResults(results.filter(u => u.id !== user?.id));
      } catch { setSearchResults([]); }
    } else { setSearchResults([]); }
  };

  const toggleUserSelection = (u: User) => {
    if (selectedUsers.find(su => su.id === u.id)) {
      setSelectedUsers(selectedUsers.filter(su => su.id !== u.id));
    } else {
      setSelectedUsers(mode === 'chat' ? [u] : [...selectedUsers, u]);
    }
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0 || !user) return;
    if (mode === 'group' && !groupName.trim()) return;
    const participantIds = [user.id, ...selectedUsers.map(u => u.id)];
    try {
      const res = await createConversation({ participantIds, name: mode === 'group' ? groupName.trim() : null, isGroup: mode === 'group' });
      if (res.success) onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-base-100 rounded-box w-96 p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{mode === 'group' ? 'New Group' : 'New Chat'}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {mode === 'group' && (
          <input type="text" placeholder="Group Name" className="input input-bordered w-full"
            value={groupName} onChange={(e) => setGroupName(e.target.value)} autoFocus />
        )}

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(su => (
              <div key={su.id} className="badge badge-primary gap-1 p-3">
                {su.username}
                <button onClick={() => toggleUserSelection(su)} className="hover:text-error">
                  <HiXMark className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input type="text" placeholder="Search username..." className="input input-bordered w-full"
          value={searchQuery} onChange={handleSearch} autoFocus={mode !== 'group'} />

        <div className="flex-1 overflow-y-auto max-h-48 border border-base-300 rounded-box p-2">
          {searchResults.length === 0 && searchQuery.length > 0 ? (
            <div className="text-center opacity-50 py-4">No users found</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center opacity-50 py-4 text-sm">Type to search for users...</div>
          ) : (
            <ul className="menu p-0">
              {searchResults.map(u => (
                <li key={u.id}>
                  <button
                    className={`flex items-center gap-3 ${selectedUsers.find(su => su.id === u.id) ? 'active' : ''}`}
                    onClick={() => toggleUserSelection(u)}
                  >
                    <Avatar url={u.avatarUrl} name={u.username} size="sm" />
                    {u.username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary"
            disabled={selectedUsers.length === 0 || (mode === 'group' && !groupName.trim())}
            onClick={handleCreate}>
            Create {mode === 'group' ? 'Group' : 'Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal; 
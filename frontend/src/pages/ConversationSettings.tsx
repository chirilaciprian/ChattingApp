import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiUserPlus, HiTrash, HiXMark } from 'react-icons/hi2';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
import * as conversationService from '../services/conversationService';
import { searchUserByUsername } from '../services/userService';
import type { Conversation, User } from '../types/types';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';
import Avatar from '../components/common/Avatar';
import { AVATARS } from '../utils/avatars';

const ConversationSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateConversationLocal } = useChat();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Avatar selector modal
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedNewUsers, setSelectedNewUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const convData = await conversationService.fetchConversationById(id);
        setConversation(convData);
        setName(convData.name || '');
        setAvatarUrl(convData.avatarUrl || '');
        setParticipants(convData.participants || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
        navigate('/chat');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!id || !conversation) return;
    try {
      setSaving(true);
      const updated = await conversationService.updateConversation(id, {
        name,
        avatarUrl,
        participantIds: participants.map(p => p.id),
        isGroup: true
      } as any);
      setConversation(updated);
      updateConversationLocal(updated);
      toast.success('Group updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveParticipant = (userId: string) => {
    if (userId === user?.id) return;
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  // Add member modal logic
  const openAddMember = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedNewUsers([]);
    setShowAddMember(true);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const results = await searchUserByUsername(query);
        // Exclude already-in-group users
        setSearchResults(results.filter(u => !participants.find(p => p.id === u.id)));
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const toggleNewUser = (u: User) => {
    setSelectedNewUsers(prev =>
      prev.find(su => su.id === u.id)
        ? prev.filter(su => su.id !== u.id)
        : [...prev, u]
    );
  };

  const handleConfirmAddMembers = () => {
    if (selectedNewUsers.length === 0) return;
    setParticipants(prev => [
      ...prev,
      ...selectedNewUsers.filter(u => !prev.find(p => p.id === u.id)),
    ]);
    setShowAddMember(false);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!conversation) return null;

  return (
    <div className="flex-1 flex flex-col bg-base-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center bg-base-100/80 backdrop-blur sticky top-0 z-10">
        <button className="btn btn-ghost btn-sm btn-circle mr-3" onClick={() => navigate('/chat')}>
          <HiArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-lg">Group Settings</h2>
      </div>

      <div className="max-w-2xl mx-auto w-full p-6 space-y-8">

        {/* Avatar + Name */}
        <div className="flex flex-col items-center space-y-4">

          {/* Avatar with hover overlay (same as Profile.tsx) */}
          <div
            className="relative group inline-block rounded-full cursor-pointer"
            onClick={() => setShowAvatarSelector(true)}
          >
            <Avatar url={avatarUrl} name={name || 'Group'} size="xxl" />
            <div className="absolute inset-0 bg-base-300/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <span className="text-sm font-bold text-base-content backdrop-blur-sm px-2 py-1 rounded-md">
                Change
              </span>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Group Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Participants ({participants.length})</h3>
            <button
              onClick={openAddMember}
              className="btn btn-primary btn-sm gap-2"
            >
              <HiUserPlus className="h-4 w-4" /> Add
            </button>
          </div>

          <div className="bg-base-200 rounded-xl divide-y divide-base-300">
            {participants.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar url={p.avatarUrl} name={p.username} size="sm" />
                  <div>
                    <div className="font-medium">
                      {p.username}
                      {p.id === user?.id && (
                        <span className="badge badge-sm badge-outline opacity-50 ml-1">You</span>
                      )}
                    </div>
                    <div className="text-xs opacity-50">{p.email}</div>
                  </div>
                </div>
                {p.id !== user?.id && (
                  <button
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="btn btn-ghost btn-sm text-error btn-circle"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-4">
          <button
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <span className="loading loading-spinner" /> : 'Save Changes'}
          </button>
          <button className="btn btn-ghost flex-1" onClick={() => navigate('/chat')}>
            Cancel
          </button>
        </div>
      </div>

      {/* ── Avatar Selector Modal (same as Profile.tsx) ── */}
      {showAvatarSelector && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Select Group Avatar</h3>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {/* "No avatar" option */}
              <div
                className={`cursor-pointer rounded-full p-1 border-2 transition-all ${!avatarUrl ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:border-base-300'}`}
                onClick={() => setAvatarUrl('')}
              >
                <Avatar name={name || 'Group'} size="lg" />
              </div>

              {AVATARS.map((url, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer rounded-full p-1 border-2 transition-all ${avatarUrl === url ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:border-base-300'}`}
                  onClick={() => setAvatarUrl(url)}
                >
                  <Avatar url={url} size="lg" />
                </div>
              ))}
            </div>

            <div className="modal-action mt-6">
              <button className="btn btn-primary" onClick={() => setShowAvatarSelector(false)}>Done</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setShowAvatarSelector(false)}>
            <button>close</button>
          </form>
        </div>
      )}

      {/* ── Add Member Modal (like CreateConversationModal.tsx) ── */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 rounded-box w-96 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Add Participants</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setShowAddMember(false)}>
                <HiXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Selected badges */}
            {selectedNewUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedNewUsers.map(su => (
                  <div key={su.id} className="badge badge-primary gap-1 p-3">
                    {su.username}
                    <button onClick={() => toggleNewUser(su)} className="hover:text-error">
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search input */}
            <input
              type="text"
              placeholder="Search username..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />

            {/* Results */}
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
                        className={`flex items-center gap-3 ${selectedNewUsers.find(su => su.id === u.id) ? 'active' : ''}`}
                        onClick={() => toggleNewUser(u)}
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
              <button className="btn" onClick={() => setShowAddMember(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={selectedNewUsers.length === 0}
                onClick={handleConfirmAddMembers}
              >
                Add {selectedNewUsers.length > 0 ? `(${selectedNewUsers.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationSettings;

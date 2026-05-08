import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiUserPlus, HiTrash } from 'react-icons/hi2';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
import * as conversationService from '../services/conversationService';
import type { Conversation, Participant, User } from '../types/types';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';
import Avatar from '../components/common/Avatar';
import { GROUP_AVATARS } from '../utils/groupAvatars';
import AddParticipantModal from '../components/chat/AddParticipantModal';
import * as participantService from '../services/participantService';

const ConversationSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateConversationLocal } = useChat();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Avatar selector modal
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);

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

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const removedParticipant = await participantService.removeParticipantFromConversation(participantId);
      if (removedParticipant) {
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      } else {
        toast.error('Failed to remove participant');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const openAddMember = () => {
    setShowAddMember(true);
  };

  const handleAddMember = async (newUser: User) => {
    if (!conversation) return;
    try {
      const newParticipant = await participantService.addParticipantToConversation({
        userId: newUser.id,
        conversationId: conversation.id,
        role: 'member'
      });
      console.log('new participant', newParticipant);
      setParticipants(prev => [...prev, newParticipant]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
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
                  <Avatar url={p.user.avatarUrl} name={p.user.username} size="sm" />
                  <div>
                    <div className="font-medium">
                      {p.user.username}
                      {p.user.id === user?.id && (
                        <span className="badge badge-sm badge-outline opacity-50 ml-1">You</span>
                      )}
                    </div>
                    <div className="text-xs opacity-50">{p.user.email}</div>
                  </div>
                </div>
                {p.user.id !== user?.id && (
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
          <button className="btn btn-neutral flex-1" onClick={() => navigate('/chat')}>
            Cancel
          </button>
        </div>
      </div>

      {/* ── Avatar Selector Modal ── */}
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

              {GROUP_AVATARS.map((url, idx) => (
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

      {/* ── Add Member Modal ── */}
      {showAddMember && (
        <AddParticipantModal
          participants={participants}
          onClose={() => setShowAddMember(false)}
          onAddUser={handleAddMember}
        />
      )}
    </div>
  );
};

export default ConversationSettings;
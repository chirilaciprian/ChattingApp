import React, { useState } from 'react';
import { HiUserPlus, HiXMark, HiCheck } from 'react-icons/hi2';
import { searchUserByUsername } from '../../services/userService';
import type { Participant, User } from '../../types/types';
import Avatar from '../common/Avatar';

interface AddParticipantModalProps {
    participants: Participant[];
    onClose: () => void;
    onAddUser: (user: User) => void;
}

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({ participants, onClose, onAddUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [addedUserIds, setAddedUserIds] = useState<Set<string>>(new Set());

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) {
            try {
                const results = await searchUserByUsername(query);
                setSearchResults(results.filter(u => !participants.find(p => p.user.id === u.id)));
            } catch {
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddUser = (u: User) => {
        onAddUser(u);
        setAddedUserIds(prev => new Set(prev).add(u.id));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-base-100 rounded-box w-96 p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add Participants</h3>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
                        <HiXMark className="w-4 h-4" />
                    </button>
                </div>

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
                            {searchResults.map(u => {
                                const isAdded = addedUserIds.has(u.id);
                                return (
                                    <li key={u.id}>
                                        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-base-200 cursor-default">
                                            <Avatar url={u.avatarUrl} name={u.username} size="sm" />
                                            <span className="flex-1 font-medium">{u.username}</span>
                                            <button
                                                onClick={() => !isAdded && handleAddUser(u)}
                                                disabled={isAdded}
                                                className={`btn btn-circle btn-sm transition-colors ${isAdded
                                                        ? 'btn-success text-success-content'
                                                        : 'btn-ghost text-primary hover:btn-primary'
                                                    }`}
                                            >
                                                {isAdded ? (
                                                    <HiCheck className="w-4 h-4" />
                                                ) : (
                                                    <HiUserPlus className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddParticipantModal;
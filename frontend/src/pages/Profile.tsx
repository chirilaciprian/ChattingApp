import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';

const Profile: React.FC = () => {
  const { user, updateUserLocal, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateUser(user.id, { username, email });
      updateUserLocal(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  console.log(user);
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex-1 flex flex-col bg-base-100 h-full overflow-y-auto">
      <div className="p-4 border-b border-base-300 flex items-center bg-base-100/80 backdrop-blur sticky top-0 z-10">
        <button
          className="btn btn-ghost btn-sm btn-circle mr-3"
          onClick={() => navigate('/chat')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="font-bold text-lg">Profile</h2>
      </div>

      <div className="flex-1 p-6 flex justify-center items-start">
        <div className="card w-full max-w-md bg-base-200 shadow-md">
          <div className="card-body items-center text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral text-neutral-content rounded-full w-24">
                <span className="text-3xl">{username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <h2 className="card-title text-2xl">{user.username}</h2>
            <p className="text-sm opacity-70 mb-6">Member since {formattedDate}</p>

            <div className="form-control w-full gap-4 text-left">
              <div>
                <label className="label pt-0 pb-1">
                  <span className="label-text font-medium">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-100"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing || isLoading}
                />
              </div>

              <div>
                <label className="label pb-1">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-base-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || isLoading}
                />
              </div>
            </div>

            <div className="w-full flex justify-end gap-2 mt-6">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-neutral px-8 w-1/2"
                    onClick={() => {
                      setUsername(user.username);
                      setEmail(user.email);
                      setIsEditing(false);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary px-8 w-1/2"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="loading loading-spinner"></span> : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="divider my-4 w-full"></div>

            <button
              className="btn btn-outline btn-error w-full"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

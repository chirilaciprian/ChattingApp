import React from 'react';
import type { Participant } from '../../types/types';

interface AvatarProps {
  url?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  isGroup?: boolean;
  participants?: Participant[];
  currentUserId?: string | number;
}

const Avatar: React.FC<AvatarProps> = ({
  url,
  name,
  size = 'md',
  className = '',
  isGroup = false,
  participants = [],
  currentUserId,
}) => {
  const sizeClasses = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
    xl: 'w-24',
    xxl: 'w-40',
  };
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
    xxl: 'text-5xl',
  };
  // Sizes for individual bubbles inside the avatar-group
  const groupBubbleSizeClasses = {
    sm: 'w-5',
    md: 'w-6',
    lg: 'w-7',
    xl: 'w-12',
    xxl: 'w-20',
  };
  const groupBubbleTextSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-lg',
    xxl: 'text-2xl',
  };

  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];
  const bubbleSizeClass = groupBubbleSizeClasses[size];
  const bubbleTextSizeClass = groupBubbleTextSizeClasses[size];

  // --- Group with no image: show DaisyUI avatar-group ---
  if (isGroup && !url) {
    // Show up to 3 participants (excluding current user), plus overflow badge
    const others = currentUserId
      ? participants.filter((p) => p.id !== currentUserId)
      : participants;
    const displayed = others.slice(0, 3);
    const overflow = others.length - displayed.length;

    return (
      <div className={`avatar-group -space-x-3 ${className}`}>
        {displayed.map((p) =>
          p.user.avatarUrl ? (
            <div key={p.user.id} className={`avatar`}>
              <div className={`${bubbleSizeClass} rounded-full`}>
                <img src={p.user.avatarUrl} alt={p.user.username || 'Member'} />
              </div>
            </div>
          ) : (
            <div key={p.user.id} className="avatar avatar-placeholder">
              <div
                className={`bg-neutral text-neutral-content rounded-full ${bubbleSizeClass}`}
              >
                <span className={bubbleTextSizeClass}>
                  {p.user.username ? p.user.username.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
            </div>
          )
        )}
        {overflow > 0 && (
          <div className="avatar avatar-placeholder">
            <div
              className={`bg-neutral text-neutral-content rounded-full ${bubbleSizeClass}`}
            >
              <span className={bubbleTextSizeClass}>+{overflow}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Regular avatar with image ---
  if (url) {
    return (
      <div className={`avatar ${className}`}>
        <div className={`${sizeClass} rounded-full bg-base-300`}>
          <img src={url} alt={name || 'Avatar'} />
        </div>
      </div>
    );
  }

  // --- Placeholder initial avatar ---
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`avatar avatar-placeholder ${className}`}>
      <div className={`bg-neutral text-neutral-content rounded-full ${sizeClass}`}>
        <span className={textSizeClass}>{initial}</span>
      </div>
    </div>
  );
};

export default Avatar;
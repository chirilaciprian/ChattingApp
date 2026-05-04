import React from 'react';

interface AvatarProps {
  url?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ url, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
    xl: 'w-24'
  };
  const sizeClass = sizeClasses[size];
  const textSizeClass = size === 'xl' ? 'text-3xl' : (size === 'lg' ? 'text-xl' : 'text-base');

  if (url) {
    return (
      <div className={`avatar ${className}`}>
        <div className={`${sizeClass} rounded-full bg-base-300`}>
          <img src={url} alt={name || 'Avatar'} />
        </div>
      </div>
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`avatar placeholder ${className}`}>
      <div className={`bg-neutral text-neutral-content rounded-full ${sizeClass}`}>
        <span className={textSizeClass}>{initial}</span>
      </div>
    </div>
  );
};

export default Avatar;

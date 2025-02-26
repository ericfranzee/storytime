import React from 'react';
import { getInitials, getRandomColor } from '@/lib/utils/string-utils';
import Image from 'next/image';

interface AvatarProps {
  user: {
    photoURL?: string | null;
    email?: string | null;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48
  };

  const initials = getInitials(user.email);
  const bgColor = getRandomColor(user.email || '?');

  if (!user.photoURL || imageError) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ 
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '50%',
          backgroundColor: bgColor
        }}
      >
        <span className="text-white font-medium text-sm">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%'
      }}
    >
      <Image
        src={user.photoURL}
        alt="User Avatar"
        width={sizeMap[size]}
        height={sizeMap[size]}
        onError={() => setImageError(true)}
        className="object-cover"
        priority
      />
    </div>
  );
};

export default Avatar;

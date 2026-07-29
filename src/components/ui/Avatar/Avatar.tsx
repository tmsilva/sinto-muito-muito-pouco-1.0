import React from 'react';
import './Avatar.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  className = '',
  ...props
}) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const fallback = name ? getInitials(name) : 'U';

  return (
    <div className={`avatar ${className}`} {...props}>
      {src ? (
        <img src={src} alt={name || 'Avatar do usuário'} referrerPolicy="no-referrer" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};
export default Avatar;

import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { MenuIcon } from '../icons';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-background-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-6)',
      position: 'sticky',
      top: 0,
      zIndex: 9
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        {/* Hamburger menu for mobile layout */}
        <button 
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text)',
            cursor: 'pointer',
            padding: '4px',
            display: 'block'
          }}
          className="md-hide" // Custom style/utility logic handled via layout container query or css below
        >
          <MenuIcon size={20} />
        </button>
        <Breadcrumbs />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }} className="sm-hide">
              {user.email}
            </span>
            <Avatar name={user.email} style={{ border: '2px solid var(--color-accent)' }} />
          </div>
        )}
      </div>

      {/* Embedded CSS for responsive hide helper classes inside header */}
      <style>{`
        @media (min-width: 768px) {
          .md-hide { display: none !important; }
        }
        @media (max-width: 576px) {
          .sm-hide { display: none !important; }
        }
      `}</style>
    </header>
  );
};

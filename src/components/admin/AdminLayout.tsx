import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text)'
    }}>
      {/* Sidebar - Desktop Layout */}
      <div 
        className="sidebar-desktop"
        style={{
          width: '260px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'block'
        }}
      >
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main style={{
          flex: 1,
          padding: 'var(--spacing-6)'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Sidebar - Mobile Layout */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
            display: 'flex'
          }} 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            style={{
              width: '280px',
              height: '100%',
              background: 'var(--color-background-card)',
              boxShadow: 'var(--shadow-lg)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Embedded CSS for layout desktop vs mobile media query toggling */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
};
export default AdminLayout;

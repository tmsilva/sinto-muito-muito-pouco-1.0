import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CloseIcon } from '../icons';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  return (
    <aside style={{
      width: '100%',
      height: '100%',
      background: 'var(--color-background-card)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-6)'
    }}>
      {/* Header element for mobile sidebar drawer */}
      {onCloseMobile && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-4)' }}>
          <button 
            onClick={onCloseMobile} 
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          >
            <CloseIcon size={20} />
          </button>
        </div>
      )}

      {/* Admin Panel Branding */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-md)', color: 'var(--color-text)' }}>
            Sinto Muito!
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Painel Admin v2.2
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', flex: 1 }}>
        {/* Module: AI */}
        <div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)', 
            fontWeight: 'bold', 
            color: 'var(--color-text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-3)'
          }}>
            Inteligência Artificial
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <NavLink 
              to="/admin/ai/models" 
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-background-hover)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              Modelos de IA
            </NavLink>
            <NavLink 
              to="/admin/ai/settings" 
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-background-hover)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              Configurações
            </NavLink>
            <NavLink 
              to="/admin/ai/prompts" 
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-background-hover)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              Templates de Prompt
            </NavLink>
            <NavLink 
              to="/admin/ai/tones" 
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-background-hover)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              Tons de Desculpa
            </NavLink>
            <NavLink 
              to="/admin/ai/playground" 
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-background-hover)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              Playground de IA
            </NavLink>
          </nav>
        </div>

        {/* Future Modules */}
        <div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)', 
            fontWeight: 'bold', 
            color: 'var(--color-text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-3)'
          }}>
            Outros Sistemas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
            {[
              'Dashboard Geral',
              'Gestão de Usuários',
              'Logs de Auditoria',
              'Analytics',
              'Integrações',
              'Billing'
            ].map((name) => (
              <div 
                key={name}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'between',
                  padding: 'var(--spacing-1) var(--spacing-3)',
                  color: 'var(--color-text-muted)', 
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }}
              >
                <span>{name}</span>
                <span style={{ 
                  fontSize: '9px', 
                  background: 'var(--color-background-hover)', 
                  padding: '1px 4px', 
                  borderRadius: '3px',
                  marginLeft: 'auto'
                }}>
                  Em breve
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

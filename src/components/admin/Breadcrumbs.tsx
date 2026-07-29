import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PATH_MAP: Record<string, string> = {
  admin: 'Administração',
  ai: 'Inteligência Artificial',
  models: 'Modelos',
  settings: 'Configurações',
  prompts: 'Prompts',
  tones: 'Tones',
  playground: 'Playground'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = PATH_MAP[value] || value;

        return (
          <React.Fragment key={to}>
            {index > 0 && <span style={{ color: 'var(--color-text-muted)' }}>/</span>}
            {last ? (
              <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>{label}</span>
            ) : (
              <Link to={to} style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }} className="hover-scale transition-all">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const AdminRoute: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState<boolean>(true);

  useEffect(() => {
    const checkRole = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      try {
        const adminStatus = await authService.hasRole(user.id, 'admin');
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error('Failed to verify admin role:', err);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkRole();
  }, [user, authLoading]);

  if (authLoading || checkingRole) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Verificando permissões de administrador...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

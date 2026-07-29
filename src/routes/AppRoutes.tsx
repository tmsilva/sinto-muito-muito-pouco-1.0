import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Health } from '../pages/Health';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/ui/Toast/ToastContext';

// Admin layout & sub-pages
import { AdminLayout } from '../components/admin/AdminLayout';
import { ModelsPage } from '../pages/admin/ai/ModelsPage';
import { SettingsPage } from '../pages/admin/ai/SettingsPage';
import { PromptsPage } from '../pages/admin/ai/PromptsPage';
import { TonesPage } from '../pages/admin/ai/TonesPage';
import { PlaygroundPage } from '../pages/admin/ai/PlaygroundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/health" element={<Health />} />

              {/* Protected generic user routes */}
              <Route element={<ProtectedRoute />}>
                {/* Any non-admin protected pages go here */}
              </Route>

              {/* Admin RBAC routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/ai/models" replace />} />
                  <Route path="ai/models" element={<ModelsPage />} />
                  <Route path="ai/settings" element={<SettingsPage />} />
                  <Route path="ai/prompts" element={<PromptsPage />} />
                  <Route path="ai/tones" element={<TonesPage />} />
                  <Route path="ai/playground" element={<PlaygroundPage />} />
                </Route>
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

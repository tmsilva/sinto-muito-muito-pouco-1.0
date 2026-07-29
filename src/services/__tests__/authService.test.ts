import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import { supabase } from '../supabaseClient';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Autenticação', () => {
    it('deve realizar login com sucesso', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { access_token: 'token', user: mockUser };
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession } as any,
        error: null,
      });

      const res = await authService.signIn('test@example.com', 'password123');
      
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.user).toEqual(mockUser);
    });

    it('deve cadastrar usuário com sucesso', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser, session: null } as any,
        error: null,
      });

      const res = await authService.signUp('test@example.com', 'password123');

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.user).toEqual(mockUser);
    });

    it('deve realizar logout com sucesso', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null } as any);

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('Perfis (Profiles)', () => {
    it('deve carregar o perfil do usuário', async () => {
      const mockProfile = { id: 'user-123', full_name: 'Thiago Silva', email: 'test@example.com' };
      
      const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const profile = await authService.getProfile('user-123');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
      expect(profile).toEqual(mockProfile);
    });

    it('deve atualizar o perfil do usuário', async () => {
      const mockProfileUpdate = { full_name: 'Novo Nome', email: 'test@example.com' };
      const mockProfileResult = { id: 'user-123', full_name: 'Novo Nome', email: 'test@example.com' };

      const mockSingle = vi.fn().mockResolvedValueOnce({ data: mockProfileResult, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockUpsert = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const res = await authService.updateProfile('user-123', mockProfileUpdate);

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
        id: 'user-123',
        full_name: 'Novo Nome',
        email: 'test@example.com'
      }));
      expect(res).toEqual(mockProfileResult);
    });
  });

  describe('Controle de Acesso (Roles & RBAC)', () => {
    it('deve retornar as roles associadas ao usuário', async () => {
      const mockUserRolesResult = [
        { roles: { name: 'user' } },
        { roles: { name: 'admin' } },
      ];

      const mockEq = vi.fn().mockResolvedValueOnce({ data: mockUserRolesResult, error: null });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const roles = await authService.getUserRoles('user-123');

      expect(supabase.from).toHaveBeenCalledWith('user_roles');
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('roles'));
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(roles).toEqual(['user', 'admin']);
    });

    it('deve responder true se o usuário possuir a role consultada', async () => {
      const mockUserRolesResult = [{ roles: { name: 'admin' } }];

      const mockEq = vi.fn().mockResolvedValue({ data: mockUserRolesResult, error: null });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      const isAdmin = await authService.hasRole('user-123', 'admin');
      expect(isAdmin).toBe(true);

      const isUser = await authService.hasRole('user-123', 'user');
      expect(isUser).toBe(false);
    });
  });
});

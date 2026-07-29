import { supabase } from './supabaseClient';
import type { Database } from '../types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const authService = {
  /**
   * Signs up a new user using Supabase Auth.
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Signs in an existing user.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Signs out the current user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Gets the current authenticated session.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Gets the current authenticated user.
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Fetches the user profile from the profiles table.
   */
  async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, profile: ProfileUpdate): Promise<ProfileRow> {
    const insertData: Database['public']['Tables']['profiles']['Insert'] = {
      id: userId,
      full_name: profile.full_name ?? null,
      avatar_url: profile.avatar_url ?? null,
      email: profile.email ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches user roles from public.user_roles joined with public.roles.
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    if (!data) return [];

    // Map query response to a list of role names
    return data
      .map((ur: any) => ur.roles?.name)
      .filter((name): name is string => typeof name === 'string');
  },

  /**
   * Checks if a user has a specific role.
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(roleName);
  }
};

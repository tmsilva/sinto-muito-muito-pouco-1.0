import { supabase } from '../services/supabaseClient';

export const excuseTonesRepository = {
  /**
   * Retrieves all active excuse tones.
   */
  async getAllActive() {
    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Retrieves a specific tone by ID.
   */
  async getById(id: string) {
    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
};

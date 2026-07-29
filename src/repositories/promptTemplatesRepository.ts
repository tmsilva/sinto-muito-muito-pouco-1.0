import { supabase } from '../services/supabaseClient';

export const promptTemplatesRepository = {
  /**
   * Retrieves the active prompt template by name.
   */
  async getActiveByName(name: string) {
    const { data, error } = await (supabase.from('prompt_templates' as any) as any)
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves all versions of a prompt template by name.
   */
  async getVersions(name: string) {
    const { data, error } = await (supabase.from('prompt_templates' as any) as any)
      .select('*')
      .eq('name', name)
      .is('deleted_at', null)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Saves a new version or new prompt template.
   */
  async save(template: {
    name: string;
    version: number;
    is_active: boolean;
    description?: string;
    system_prompt: string;
    user_prompt: string;
    created_by?: string;
  }) {
    const payload = {
      ...template,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase.from('prompt_templates' as any) as any)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

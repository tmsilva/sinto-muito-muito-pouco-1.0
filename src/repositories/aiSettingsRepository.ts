import { supabase } from '../services/supabaseClient';

export const aiSettingsRepository = {
  /**
   * Retrieves the latest active global AI configuration settings.
   */
  async getLatest() {
    const { data, error } = await (supabase.from('ai_settings' as any) as any)
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Creates or updates AI settings.
   */
  async save(settings: {
    id?: string;
    default_model_id: string;
    temperature: number;
    max_tokens: number;
    timeout_ms: number;
    system_prompt: string;
  }) {
    const payload = {
      ...settings,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase.from('ai_settings' as any) as any)
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

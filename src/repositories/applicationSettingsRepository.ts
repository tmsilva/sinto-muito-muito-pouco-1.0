import { supabase } from '../services/supabaseClient';
import type { ApplicationSetting } from '../types/domain.types';

export const applicationSettingsRepository = {
  /**
   * Retrieves a setting record by its key.
   */
  async getByKey(key: string): Promise<ApplicationSetting | null> {
    const { data, error } = await (supabase.from('application_settings' as any) as any)
      .select('*')
      .eq('key', key)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw error;
    return data as ApplicationSetting | null;
  },

  /**
   * Saves or updates a setting key-value pair.
   */
  async save(setting: {
    key: string;
    value: string;
    type?: string;
    description?: string;
  }): Promise<ApplicationSetting> {
    const payload = {
      ...setting,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase.from('application_settings' as any) as any)
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as ApplicationSetting;
  }
};

import { supabase } from '../services/supabaseClient';
import type { AIModel } from '../types/domain.types';

export const aiModelsRepository = {
  /**
   * Retrieves all active and non-deprecated AI models sorted by sort_order.
   */
  async getAllActive(): Promise<AIModel[]> {
    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .select('*')
      .eq('is_active', true)
      .eq('is_deprecated', false)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data as AIModel[]) || [];
  },

  /**
   * Retrieves a model by its ID.
   */
  async getById(id: string): Promise<AIModel | null> {
    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as AIModel;
  }
};

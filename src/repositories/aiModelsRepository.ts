import { supabase } from '../services/supabaseClient';
import type { AIModel } from '../types/domain.types';
import { isValidUUID } from '../utils/uuid';

export interface CreateAIModelPayload {
  provider: string;
  model_name: string;
  display_name: string;
  api_identifier: string;
  is_active?: boolean;
  is_deprecated?: boolean;
  sort_order?: number;
  context_window?: number;
  max_tokens_limit?: number;
}

export interface UpdateAIModelPayload {
  provider?: string;
  model_name?: string;
  display_name?: string;
  api_identifier?: string;
  is_active?: boolean;
  is_deprecated?: boolean;
  sort_order?: number;
  context_window?: number;
  max_tokens_limit?: number;
}

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
   * Retrieves all models (including deprecated/inactive) for management.
   */
  async getAll(): Promise<AIModel[]> {
    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data as AIModel[]) || [];
  },

  /**
   * Retrieves a model by its ID.
   */
  async getById(id: string): Promise<AIModel | null> {
    if (!isValidUUID(id)) return null;

    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as AIModel;
  },

  /**
   * Creates a new AI Model.
   */
  async create(payload: CreateAIModelPayload): Promise<AIModel> {
    const { context_window, max_tokens_limit, ...rest } = payload as any;
    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .insert({
        ...rest,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as AIModel;
  },

  /**
   * Updates an existing AI Model.
   */
  async update(id: string, payload: UpdateAIModelPayload): Promise<AIModel> {
    if (!isValidUUID(id)) {
      throw new Error(`ID de modelo inválido: ${id}`);
    }

    const { context_window, max_tokens_limit, ...rest } = payload as any;
    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .update({
        ...rest,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIModel;
  },

  /**
   * Soft deletes a model by setting deleted_at.
   */
  async delete(id: string): Promise<AIModel> {
    if (!isValidUUID(id)) {
      throw new Error(`ID de modelo inválido: ${id}`);
    }

    const { data, error } = await (supabase.from('ai_models' as any) as any)
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIModel;
  }
};

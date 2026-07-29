import { supabase } from '../services/supabaseClient';
import type { ExcuseTone } from '../types/domain.types';
import { isValidUUID } from '../utils/uuid';

export interface CreateExcuseTonePayload {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateExcuseTonePayload {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export const excuseTonesRepository = {
  /**
   * Retrieves all active excuse tones.
   */
  async getAllActive(): Promise<ExcuseTone[]> {
    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data as ExcuseTone[]) || [];
  },

  /**
   * Retrieves all excuse tones (active and inactive) for management.
   */
  async getAll(): Promise<ExcuseTone[]> {
    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data as ExcuseTone[]) || [];
  },

  /**
   * Retrieves a specific tone by ID. Returns null if ID is invalid UUID.
   */
  async getById(id: string): Promise<ExcuseTone | null> {
    if (!isValidUUID(id)) {
      return null;
    }

    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as ExcuseTone;
  },

  /**
   * Inserts a new excuse tone into the database.
   */
  async create(payload: CreateExcuseTonePayload): Promise<ExcuseTone> {
    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .insert({
        name: payload.name,
        description: payload.description || null,
        is_active: payload.is_active ?? true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as ExcuseTone;
  },

  /**
   * Updates an existing excuse tone.
   */
  async update(id: string, payload: UpdateExcuseTonePayload): Promise<ExcuseTone> {
    if (!isValidUUID(id)) {
      throw new Error(`ID de tom inválido: ${id}`);
    }

    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ExcuseTone;
  },

  /**
   * Soft deletes an excuse tone by setting deleted_at.
   */
  async delete(id: string): Promise<ExcuseTone> {
    if (!isValidUUID(id)) {
      throw new Error(`ID de tom inválido: ${id}`);
    }

    const { data, error } = await (supabase.from('excuse_tones' as any) as any)
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ExcuseTone;
  }
};

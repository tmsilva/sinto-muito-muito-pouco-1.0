import { supabase } from '../services/supabaseClient';

export interface AuditLogPayload {
  user_id?: string;
  entity: string;
  entity_id?: string;
  action: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const auditLogsRepository = {
  /**
   * Inserts an audit log record into the database.
   */
  async log(payload: AuditLogPayload) {
    const { data, error } = await (supabase.from('audit_logs' as any) as any)
      .insert({
        ...payload,
        metadata: payload.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves all logs for a specific entity.
   */
  async getByEntity(entity: string, entityId?: string) {
    let query = (supabase.from('audit_logs' as any) as any)
      .select('*')
      .eq('entity', entity);

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

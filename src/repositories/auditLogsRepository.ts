import { supabase } from '../services/supabaseClient';
import type { AuditLog } from '../types/domain.types';
import { isValidUUID } from '../utils/uuid';

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
   * Inserts an audit log record into the database without needing SELECT readback permissions.
   */
  async log(payload: AuditLogPayload): Promise<AuditLog | null> {
    const sanitizedPayload = {
      entity: payload.entity,
      action: payload.action,
      user_id: isValidUUID(payload.user_id) ? payload.user_id : null,
      entity_id: isValidUUID(payload.entity_id) ? payload.entity_id : null,
      metadata: payload.metadata || {},
      ip_address: payload.ip_address || null,
      user_agent: payload.user_agent || null
    };

    const { data, error } = await (supabase.from('audit_logs' as any) as any)
      .insert(sanitizedPayload);

    if (error) {
      console.warn('Audit log write skipped:', error.message);
      return null;
    }
    return (data?.[0] as AuditLog) || null;
  },

  /**
   * Retrieves all logs for a specific entity.
   */
  async getByEntity(entity: string, entityId?: string): Promise<AuditLog[]> {
    let query = (supabase.from('audit_logs' as any) as any)
      .select('*')
      .eq('entity', entity);

    if (entityId && isValidUUID(entityId)) {
      query = query.eq('entity_id', entityId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data as AuditLog[]) || [];
  }
};

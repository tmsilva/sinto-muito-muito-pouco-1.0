import { auditLogsRepository } from '../repositories/auditLogsRepository';
import type { AuditLogPayload } from '../repositories/auditLogsRepository';

export const auditLogsService = {
  /**
   * Logs a user or system activity event.
   */
  async writeLog(payload: AuditLogPayload) {
    return auditLogsRepository.log(payload);
  },

  /**
   * Retrieves all logs filtered by entity name and optional ID.
   */
  async listLogsForEntity(entity: string, entityId?: string) {
    return auditLogsRepository.getByEntity(entity, entityId);
  }
};

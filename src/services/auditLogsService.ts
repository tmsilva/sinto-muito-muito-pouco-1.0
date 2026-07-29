import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { AuditLogPayload } from '../repositories/auditLogsRepository';
import type { ServiceResponse } from '../utils/errors';
import type { AuditLog } from '../types/domain.types';

export const auditLogsService = {
  /**
   * Logs a user or system activity event.
   */
  async writeLog(payload: AuditLogPayload): Promise<ServiceResponse<AuditLog | null>> {
    try {
      const logged = await auditLogsRepository.log(payload);
      return createSuccessResponse(logged);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao registrar log de auditoria: ${error.message || error}`));
    }
  },

  /**
   * Retrieves all logs filtered by entity name and optional ID.
   */
  async listLogsForEntity(entity: string, entityId?: string): Promise<ServiceResponse<AuditLog[]>> {
    try {
      const logs = await auditLogsRepository.getByEntity(entity, entityId);
      return createSuccessResponse(logs);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter logs de auditoria: ${error.message || error}`));
    }
  }
};

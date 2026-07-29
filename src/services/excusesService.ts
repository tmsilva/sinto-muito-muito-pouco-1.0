import { excusesRepository } from '../repositories/excusesRepository';
import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { SaveExcusePayload } from '../repositories/excusesRepository';
import type { ServiceResponse } from '../utils/errors';
import type { Excuse } from '../types/domain.types';

export const excusesService = {
  /**
   * Saves a generated excuse record.
   */
  async saveExcuse(payload: SaveExcusePayload): Promise<ServiceResponse<Excuse>> {
    try {
      const saved = await excusesRepository.save(payload);
      return createSuccessResponse(saved);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao salvar histórico de desculpa: ${error.message || error}`));
    }
  },

  /**
   * Retrieves excuse history for a specific user.
   */
  async getUserHistory(userId: string): Promise<ServiceResponse<Excuse[]>> {
    try {
      const history = await excusesRepository.getByUser(userId);
      return createSuccessResponse(history);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter histórico do usuário: ${error.message || error}`));
    }
  },

  /**
   * Toggles favorite status of an excuse record.
   */
  async toggleFavorite(id: string, favorite: boolean, userId?: string): Promise<ServiceResponse<Excuse>> {
    try {
      const updated = await excusesRepository.setFavorite(id, favorite);

      // Audit log
      await auditLogsRepository.log({
        user_id: userId || updated.user_id || undefined,
        entity: 'excuses',
        entity_id: updated.id,
        action: favorite ? 'FAVORITAR_DESCULPA' : 'DESFAVORITAR_DESCULPA',
        metadata: {
          favorite
        }
      }).catch(() => {});

      return createSuccessResponse(updated);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao atualizar favorito: ${error.message || error}`));
    }
  },

  /**
   * Removes an excuse record (soft delete) and writes audit logs.
   */
  async removeExcuse(id: string, userId?: string): Promise<ServiceResponse<Excuse>> {
    try {
      const deleted = await excusesRepository.delete(id);
      await auditLogsRepository.log({
        user_id: userId || deleted.user_id || undefined,
        entity: 'excuses',
        entity_id: deleted.id,
        action: 'REMOVER_DESCULPA',
        metadata: {
          soft_delete: true
        }
      }).catch(() => {});

      return createSuccessResponse(deleted);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao remover desculpa: ${error.message || error}`));
    }
  }
};

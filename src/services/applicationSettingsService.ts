import { applicationSettingsRepository } from '../repositories/applicationSettingsRepository';
import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { ApplicationSetting } from '../types/domain.types';

const cache = new MemoryCache<ApplicationSetting>(600000); // 10 minutes cache

export const applicationSettingsService = {
  /**
   * Retrieves a configuration setting value.
   */
  async getSetting(key: string): Promise<ServiceResponse<ApplicationSetting | null>> {
    const cacheKey = `app_setting_${key}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const setting = await applicationSettingsRepository.getByKey(key);
      if (setting) {
        cache.set(cacheKey, setting);
      }
      return createSuccessResponse(setting);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter configuração: ${error.message || error}`));
    }
  },

  /**
   * Creates or updates a configuration setting value and records audit log.
   */
  async saveSetting(
    setting: {
      key: string;
      value: string;
      type?: string;
      description?: string;
    },
    changedByUserId?: string
  ): Promise<ServiceResponse<ApplicationSetting>> {
    try {
      const saved = await applicationSettingsRepository.save(setting);
      
      // Invalidate specific cache key
      cache.invalidate(`app_setting_${setting.key}`);

      // Audit Log
      await auditLogsRepository.log({
        user_id: changedByUserId,
        entity: 'application_settings',
        entity_id: saved.id,
        action: 'ALTERAÇÃO_DE_CONFIGURAÇÃO',
        metadata: {
          key: saved.key,
          type: saved.type
        }
      });

      return createSuccessResponse(saved);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao salvar configuração: ${error.message || error}`));
    }
  },

  /**
   * Invalidates active setting cache by key.
   */
  invalidateCache(key: string) {
    cache.invalidate(`app_setting_${key}`);
  }
};

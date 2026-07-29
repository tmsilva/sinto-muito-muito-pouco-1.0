import { aiSettingsRepository } from '../repositories/aiSettingsRepository';
import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { AISettings } from '../types/domain.types';

const cache = new MemoryCache<AISettings>(600000); // 10 minutes cache
const CACHE_KEY = 'latest_settings';

export const aiSettingsService = {
  /**
   * Retrieves the current active global AI settings.
   */
  async getCurrentSettings(): Promise<ServiceResponse<AISettings | null>> {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const settings = await aiSettingsRepository.getLatest();
      if (settings) {
        cache.set(CACHE_KEY, settings);
      }
      return createSuccessResponse(settings);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter configurações de IA: ${error.message || error}`));
    }
  },

  /**
   * Creates or updates global AI settings and registers audits.
   */
  async saveSettings(
    settings: {
      id?: string;
      default_model_id: string;
      temperature: number;
      max_tokens: number;
      timeout_ms: number;
      system_prompt: string;
    },
    changedByUserId?: string
  ): Promise<ServiceResponse<AISettings>> {
    try {
      const saved = await aiSettingsRepository.save(settings);
      cache.set(CACHE_KEY, saved);

      // Audit log
      await auditLogsRepository.log({
        user_id: changedByUserId,
        entity: 'ai_settings',
        entity_id: saved.id,
        action: 'ALTERAÇÃO_DE_CONFIGURAÇÃO',
        metadata: {
          default_model_id: saved.default_model_id,
          temperature: saved.temperature,
          max_tokens: saved.max_tokens
        }
      });

      return createSuccessResponse(saved);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao salvar configurações de IA: ${error.message || error}`));
    }
  },

  /**
   * Invalidates the settings cache.
   */
  invalidateCache() {
    cache.invalidate(CACHE_KEY);
  }
};

import { aiModelsRepository } from '../repositories/aiModelsRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { AIModel } from '../types/domain.types';

const cache = new MemoryCache<AIModel[]>(600000); // 10 minutes cache

export const aiModelsService = {
  /**
   * Retrieves all active and non-deprecated AI models.
   */
  async listActive(): Promise<ServiceResponse<AIModel[]>> {
    const cacheKey = 'active_models';
    const cached = cache.get(cacheKey);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const models = await aiModelsRepository.getAllActive();
      cache.set(cacheKey, models);
      return createSuccessResponse(models);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar modelos: ${error.message || error}`));
    }
  },

  /**
   * Retrieves a specific AI model by ID.
   */
  async getModel(id: string): Promise<ServiceResponse<AIModel | null>> {
    try {
      const model = await aiModelsRepository.getById(id);
      return createSuccessResponse(model);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao buscar modelo: ${error.message || error}`));
    }
  },

  /**
   * Invalidates the models cache.
   */
  invalidateCache() {
    cache.invalidate('active_models');
  }
};

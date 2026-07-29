import { aiModelsRepository } from '../repositories/aiModelsRepository';
import type { CreateAIModelPayload, UpdateAIModelPayload } from '../repositories/aiModelsRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { AIModel } from '../types/domain.types';

const cache = new MemoryCache<AIModel[]>(600000); // 10 minutes cache
const CACHE_KEY = 'active_models';

export const aiModelsService = {
  /**
   * Retrieves all active and non-deprecated AI models.
   */
  async listActive(): Promise<ServiceResponse<AIModel[]>> {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const models = await aiModelsRepository.getAllActive();
      cache.set(CACHE_KEY, models);
      return createSuccessResponse(models);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar modelos ativos: ${error.message || error}`));
    }
  },

  /**
   * Retrieves all AI models for management.
   */
  async listAll(): Promise<ServiceResponse<AIModel[]>> {
    try {
      const models = await aiModelsRepository.getAll();
      return createSuccessResponse(models);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar todos os modelos: ${error.message || error}`));
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
   * Creates a new AI Model.
   */
  async createModel(payload: CreateAIModelPayload): Promise<ServiceResponse<AIModel>> {
    try {
      const created = await aiModelsRepository.create(payload);
      this.invalidateCache();
      return createSuccessResponse(created);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao criar modelo: ${error.message || error}`));
    }
  },

  /**
   * Updates an existing AI Model.
   */
  async updateModel(id: string, payload: UpdateAIModelPayload): Promise<ServiceResponse<AIModel>> {
    try {
      const updated = await aiModelsRepository.update(id, payload);
      this.invalidateCache();
      return createSuccessResponse(updated);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao atualizar modelo: ${error.message || error}`));
    }
  },

  /**
   * Deletes an AI Model by ID.
   */
  async deleteModel(id: string): Promise<ServiceResponse<AIModel>> {
    try {
      const deleted = await aiModelsRepository.delete(id);
      this.invalidateCache();
      return createSuccessResponse(deleted);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao remover modelo: ${error.message || error}`));
    }
  },

  /**
   * Seeds default AI models.
   */
  async seedDefaultModels(): Promise<ServiceResponse<AIModel[]>> {
    const defaults = [
      {
        provider: 'google',
        model_name: 'gemini-3.5-flash',
        display_name: 'Gemini 3.5 Flash',
        api_identifier: 'gemini-3.5-flash',
        is_active: true,
        is_deprecated: false,
        sort_order: 1,
        context_window: 1048576,
        max_tokens_limit: 8192
      },
      {
        provider: 'google',
        model_name: 'gemini-3.5-pro',
        display_name: 'Gemini 3.5 Pro',
        api_identifier: 'gemini-3.5-pro',
        is_active: true,
        is_deprecated: false,
        sort_order: 2,
        context_window: 2097152,
        max_tokens_limit: 8192
      },
      {
        provider: 'google',
        model_name: 'gemini-3.6-flash',
        display_name: 'Gemini 3.6 Flash',
        api_identifier: 'gemini-3.6-flash',
        is_active: true,
        is_deprecated: false,
        sort_order: 3,
        context_window: 1048576,
        max_tokens_limit: 8192
      },
      {
        provider: 'google',
        model_name: 'gemini-3.6-pro',
        display_name: 'Gemini 3.6 Pro',
        api_identifier: 'gemini-3.6-pro',
        is_active: true,
        is_deprecated: false,
        sort_order: 4,
        context_window: 2097152,
        max_tokens_limit: 8192
      },
      {
        provider: 'openai',
        model_name: 'gpt-4o',
        display_name: 'GPT-4o',
        api_identifier: 'gpt-4o',
        is_active: true,
        is_deprecated: false,
        sort_order: 5,
        context_window: 128000,
        max_tokens_limit: 4096
      },
      {
        provider: 'openai',
        model_name: 'gpt-4o-mini',
        display_name: 'GPT-4o mini',
        api_identifier: 'gpt-4o-mini',
        is_active: true,
        is_deprecated: false,
        sort_order: 6,
        context_window: 128000,
        max_tokens_limit: 4096
      },
      {
        provider: 'anthropic',
        model_name: 'claude-3-5-sonnet',
        display_name: 'Claude 3.5 Sonnet',
        api_identifier: 'claude-3-5-sonnet-20241022',
        is_active: true,
        is_deprecated: false,
        sort_order: 7,
        context_window: 200000,
        max_tokens_limit: 8192
      },
      {
        provider: 'groq',
        model_name: 'llama3-8b',
        display_name: 'Llama 3 8B',
        api_identifier: 'llama3-8b-8192',
        is_active: true,
        is_deprecated: false,
        sort_order: 8,
        context_window: 8192,
        max_tokens_limit: 8192
      }
    ];

    try {
      const createdModels: AIModel[] = [];
      const existing = await aiModelsRepository.getAll();
      for (const item of defaults) {
        const found = existing.find(m => m.api_identifier === item.api_identifier);
        if (!found) {
          const res = await aiModelsRepository.create(item);
          createdModels.push(res);
        }
      }
      this.invalidateCache();
      return createSuccessResponse(createdModels);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao popular modelos: ${error.message || error}`));
    }
  },

  /**
   * Invalidates the models cache.
   */
  invalidateCache() {
    cache.invalidate(CACHE_KEY);
  }
};

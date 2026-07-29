import { excuseTonesRepository } from '../repositories/excuseTonesRepository';
import type { CreateExcuseTonePayload, UpdateExcuseTonePayload } from '../repositories/excuseTonesRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { ExcuseTone } from '../types/domain.types';

const cache = new MemoryCache<ExcuseTone[]>(600000); // 10 minutes cache
const CACHE_KEY = 'active_tones';

export const excuseTonesService = {
  /**
   * Retrieves all active excuse tones.
   */
  async listActiveTones(): Promise<ServiceResponse<ExcuseTone[]>> {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const tones = await excuseTonesRepository.getAllActive();
      cache.set(CACHE_KEY, tones);
      return createSuccessResponse(tones);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter tons de desculpas: ${error.message || error}`));
    }
  },

  /**
   * Retrieves all excuse tones (active and inactive) for admin management.
   */
  async listAllTones(): Promise<ServiceResponse<ExcuseTone[]>> {
    try {
      const tones = await excuseTonesRepository.getAll();
      return createSuccessResponse(tones);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar todos os tons: ${error.message || error}`));
    }
  },

  /**
   * Retrieves a specific tone by ID.
   */
  async getTone(id: string): Promise<ServiceResponse<ExcuseTone | null>> {
    try {
      const tone = await excuseTonesRepository.getById(id);
      return createSuccessResponse(tone);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter tom: ${error.message || error}`));
    }
  },

  /**
   * Creates a new excuse tone and invalidates active cache.
   */
  async createTone(payload: CreateExcuseTonePayload): Promise<ServiceResponse<ExcuseTone>> {
    try {
      const created = await excuseTonesRepository.create(payload);
      this.invalidateCache();
      return createSuccessResponse(created);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao criar tom: ${error.message || error}`));
    }
  },

  /**
   * Updates an existing tone and invalidates active cache.
   */
  async updateTone(id: string, payload: UpdateExcuseTonePayload): Promise<ServiceResponse<ExcuseTone>> {
    try {
      const updated = await excuseTonesRepository.update(id, payload);
      this.invalidateCache();
      return createSuccessResponse(updated);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao atualizar tom: ${error.message || error}`));
    }
  },

  /**
   * Deletes a tone by ID and invalidates active cache.
   */
  async deleteTone(id: string): Promise<ServiceResponse<ExcuseTone>> {
    try {
      const deleted = await excuseTonesRepository.delete(id);
      this.invalidateCache();
      return createSuccessResponse(deleted);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao remover tom: ${error.message || error}`));
    }
  },

  /**
   * Populates default tones into the database if none exist.
   */
  async seedDefaultTones(): Promise<ServiceResponse<ExcuseTone[]>> {
    const defaultTones: CreateExcuseTonePayload[] = [
      { name: 'Sincero', description: 'Tom honesto, direto e transparente.' },
      { name: 'Irônico', description: 'Tom sarcástico e bem-humorado.' },
      { name: 'Corporativo', description: 'Linguagem formal e jargão executivo.' },
      { name: 'Dramático', description: 'Tom exagerado e emotivo.' },
      { name: 'Minimalista', description: 'Resposta extremamente curta e objetiva.' }
    ];

    try {
      const createdTones: ExcuseTone[] = [];
      for (const tone of defaultTones) {
        try {
          const created = await excuseTonesRepository.create(tone);
          createdTones.push(created);
        } catch {
          // Ignore unique constraint errors if already inserted
        }
      }
      this.invalidateCache();
      return createSuccessResponse(createdTones);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao cadastrar tons padrão: ${error.message || error}`));
    }
  },

  /**
   * Invalidates the tones cache.
   */
  invalidateCache() {
    cache.invalidate(CACHE_KEY);
  }
};

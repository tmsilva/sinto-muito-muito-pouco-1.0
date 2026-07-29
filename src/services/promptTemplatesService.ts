import { promptTemplatesRepository } from '../repositories/promptTemplatesRepository';
import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { MemoryCache } from '../utils/cache';
import { RepositoryError, createSuccessResponse, createErrorResponse } from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { PromptTemplate } from '../types/domain.types';

const cache = new MemoryCache<PromptTemplate>(600000); // 10 minutes cache

export const promptTemplatesService = {
  /**
   * Gets the active template by name.
   */
  async getActiveTemplate(name: string): Promise<ServiceResponse<PromptTemplate | null>> {
    const cacheKey = `active_template_${name}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return createSuccessResponse(cached);
    }

    try {
      const template = await promptTemplatesRepository.getActiveByName(name);
      if (template) {
        cache.set(cacheKey, template);
      }
      return createSuccessResponse(template);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao obter template de prompt: ${error.message || error}`));
    }
  },

  /**
   * Retrieves all versions of a prompt template by name.
   */
  async listVersions(name: string): Promise<ServiceResponse<PromptTemplate[]>> {
    try {
      const versions = await promptTemplatesRepository.getVersions(name);
      return createSuccessResponse(versions);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar versões do prompt: ${error.message || error}`));
    }
  },

  /**
   * Creates a new version of a prompt template and logs an audit.
   */
  async createTemplateVersion(
    template: {
      name: string;
      version: number;
      is_active: boolean;
      description?: string;
      system_prompt: string;
      user_prompt: string;
      created_by?: string;
    },
    changedByUserId?: string
  ): Promise<ServiceResponse<PromptTemplate>> {
    try {
      const saved = await promptTemplatesRepository.save(template);
      
      // Invalidate the cache for this prompt name
      cache.invalidate(`active_template_${template.name}`);

      // Audit Log
      await auditLogsRepository.log({
        user_id: changedByUserId,
        entity: 'prompt_templates',
        entity_id: saved.id,
        action: 'ALTERAÇÃO_DE_PROMPT',
        metadata: {
          name: saved.name,
          version: saved.version,
          is_active: saved.is_active
        }
      });

      return createSuccessResponse(saved);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao criar nova versão do prompt: ${error.message || error}`));
    }
  },

  /**
   * Invalidates active template cache by name.
   */
  invalidateCache(name: string) {
    cache.invalidate(`active_template_${name}`);
  }
};

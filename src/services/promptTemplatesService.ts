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
   * Retrieves all templates (latest version of each family) for management.
   */
  async listTemplates(): Promise<ServiceResponse<PromptTemplate[]>> {
    try {
      const templates = await promptTemplatesRepository.getAllLatest();
      return createSuccessResponse(templates);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao listar templates: ${error.message || error}`));
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
      }).catch(() => {});

      return createSuccessResponse(saved);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao criar nova versão do prompt: ${error.message || error}`));
    }
  },

  /**
   * Seeds default prompt templates.
   */
  async seedDefaultTemplates(): Promise<ServiceResponse<PromptTemplate[]>> {
    const defaults = [
      {
        name: 'default_generator',
        version: 1,
        is_active: true,
        description: 'Template de prompt padrão para geração de desculpas',
        system_prompt: 'Você é um assistente de IA especialista em gerar desculpas criativas, convincentes e personalizadas.',
        user_prompt: 'Gere uma desculpa sincera e criativa para a seguinte enrascada: "{context}". O tom da desculpa deve ser "{tone}".'
      }
    ];

    try {
      const createdTemplates: PromptTemplate[] = [];
      const existing = await promptTemplatesRepository.getAllLatest();
      for (const item of defaults) {
        const found = existing.find(t => t.name === item.name);
        if (!found) {
          const res = await promptTemplatesRepository.save(item);
          createdTemplates.push(res);
        }
      }
      return createSuccessResponse(createdTemplates);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao popular templates: ${error.message || error}`));
    }
  },

  /**
   * Deletes a prompt template family by name.
   */
  async deleteTemplate(name: string): Promise<ServiceResponse<void>> {
    try {
      await promptTemplatesRepository.deleteByName(name);
      cache.invalidate(`active_template_${name}`);
      return createSuccessResponse(undefined);
    } catch (error: any) {
      return createErrorResponse(new RepositoryError(`Erro ao excluir template: ${error.message || error}`));
    }
  },

  /**
   * Invalidates active template cache by name.
   */
  invalidateCache(name: string) {
    cache.invalidate(`active_template_${name}`);
  }
};

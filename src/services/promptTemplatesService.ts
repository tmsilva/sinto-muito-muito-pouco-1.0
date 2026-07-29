import { promptTemplatesRepository } from '../repositories/promptTemplatesRepository';

export const promptTemplatesService = {
  /**
   * Gets the active template by name.
   */
  async getActiveTemplate(name: string) {
    return promptTemplatesRepository.getActiveByName(name);
  },

  /**
   * Retrieves all versions of a prompt template by name.
   */
  async listVersions(name: string) {
    return promptTemplatesRepository.getVersions(name);
  },

  /**
   * Creates a new version of a prompt template.
   */
  async createTemplateVersion(template: {
    name: string;
    version: number;
    is_active: boolean;
    description?: string;
    system_prompt: string;
    user_prompt: string;
    created_by?: string;
  }) {
    return promptTemplatesRepository.save(template);
  }
};

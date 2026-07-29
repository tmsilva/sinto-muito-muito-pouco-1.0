import { aiSettingsRepository } from '../repositories/aiSettingsRepository';

export const aiSettingsService = {
  /**
   * Retrieves the current active global AI settings.
   */
  async getCurrentSettings() {
    return aiSettingsRepository.getLatest();
  },

  /**
   * Creates or updates AI settings.
   */
  async saveSettings(settings: {
    id?: string;
    default_model_id: string;
    temperature: number;
    max_tokens: number;
    timeout_ms: number;
    system_prompt: string;
  }) {
    return aiSettingsRepository.save(settings);
  }
};

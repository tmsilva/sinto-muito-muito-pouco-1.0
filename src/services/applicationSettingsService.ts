import { applicationSettingsRepository } from '../repositories/applicationSettingsRepository';

export const applicationSettingsService = {
  /**
   * Retrieves a configuration setting value.
   */
  async getSetting(key: string) {
    return applicationSettingsRepository.getByKey(key);
  },

  /**
   * Creates or updates a configuration setting value.
   */
  async saveSetting(setting: {
    key: string;
    value: string;
    type?: string;
    description?: string;
  }) {
    return applicationSettingsRepository.save(setting);
  }
};

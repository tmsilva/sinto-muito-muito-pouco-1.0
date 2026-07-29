import { aiModelsRepository } from '../repositories/aiModelsRepository';

export const aiModelsService = {
  /**
   * Retrieves all active and non-deprecated AI models.
   */
  async listActive() {
    return aiModelsRepository.getAllActive();
  },

  /**
   * Retrieves a specific AI model by ID.
   */
  async getModel(id: string) {
    return aiModelsRepository.getById(id);
  }
};

import { excuseTonesRepository } from '../repositories/excuseTonesRepository';

export const excuseTonesService = {
  /**
   * Retrieves all active excuse tones.
   */
  async listActiveTones() {
    return excuseTonesRepository.getAllActive();
  },

  /**
   * Retrieves a specific tone by ID.
   */
  async getTone(id: string) {
    return excuseTonesRepository.getById(id);
  }
};

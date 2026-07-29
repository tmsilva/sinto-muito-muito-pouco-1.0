import { excusesRepository } from '../repositories/excusesRepository';
import type { SaveExcusePayload } from '../repositories/excusesRepository';

export const excusesService = {
  /**
   * Saves a generated excuse record.
   */
  async saveExcuse(payload: SaveExcusePayload) {
    return excusesRepository.save(payload);
  },

  /**
   * Retrieves the generation history for a specific user.
   */
  async getUserHistory(userId: string) {
    return excusesRepository.getByUser(userId);
  },

  /**
   * Toggles the favorite status of a specific excuse record.
   */
  async toggleFavorite(id: string, favorite: boolean) {
    return excusesRepository.setFavorite(id, favorite);
  },

  /**
   * Removes an excuse record (soft delete).
   */
  async removeExcuse(id: string) {
    return excusesRepository.softDelete(id);
  }
};

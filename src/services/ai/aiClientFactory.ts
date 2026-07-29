import type { AIClient } from './AIClient';
import { GeminiAIClient } from './GeminiAIClient';
import { ConfigurationError } from '../../utils/errors';

export const aiClientFactory = {
  /**
   * Resolves and returns the AIClient provider configured in VITE_AI_PROVIDER.
   */
  getProvider(): AIClient {
    const provider = import.meta.env.VITE_AI_PROVIDER || 'gemini';
    
    switch (provider.toLowerCase()) {
      case 'gemini':
        return new GeminiAIClient();
      default:
        throw new ConfigurationError(`Provedor de IA desconhecido ou não suportado: ${provider}`);
    }
  }
};

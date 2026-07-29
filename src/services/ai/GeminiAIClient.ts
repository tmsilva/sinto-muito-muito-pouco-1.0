import type { AIClient, AIModelOptions } from './AIClient';
import { AIError, ConfigurationError } from '../../utils/errors';

export class GeminiAIClient implements AIClient {
  /**
   * Generates content calling the Gemini API REST endpoint.
   */
  async generate(prompt: string, modelIdentifier: string, options: AIModelOptions): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new ConfigurationError('VITE_GEMINI_API_KEY não foi configurada no ambiente.');
    }
    try {
      let url = `https://generativelanguage.googleapis.com/v1beta/models/${modelIdentifier}:generateContent`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (apiKey.startsWith('AIzaSy')) {
        url += `?key=${apiKey}`;
      } else {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens
        },
        systemInstruction: options.systemInstruction 
          ? { parts: [{ text: options.systemInstruction }] }
          : undefined
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Nenhuma resposta de texto válida gerada pelo modelo do Gemini.');
      }

      return text;
    } catch (error: any) {
      throw new AIError(`Falha na chamada ao Gemini API: ${error.message || error}`);
    }
  }
}

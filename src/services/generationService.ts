import { aiSettingsService } from './aiSettingsService';
import { aiModelsService } from './aiModelsService';
import { excuseTonesService } from './excuseTonesService';
import { promptTemplatesService } from './promptTemplatesService';
import { excusesService } from './excusesService';
import { auditLogsService } from './auditLogsService';
import { aiClientFactory } from './ai/aiClientFactory';
import { isValidUUID } from '../utils/uuid';
import { 
  AIError, 
  ValidationError, 
  ConfigurationError, 
  createSuccessResponse, 
  createErrorResponse 
} from '../utils/errors';
import type { ServiceResponse } from '../utils/errors';
import type { Excuse } from '../types/domain.types';

export const generationService = {
  /**
   * Orchestrates the complete AI generation pipeline.
   */
  async generateExcuse(params: {
    userId?: string;
    contextInput: string;
    toneId: string;
    toneName?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ServiceResponse<Excuse>> {
    const startTime = Date.now();

    if (!params.contextInput || !params.contextInput.trim()) {
      return createErrorResponse(new ValidationError('O contexto informado não pode estar vazio.'));
    }

    let defaultModelId: string | null = null;
    let modelIdentifier = 'gemini-2.5-flash';
    let temperature = 0.7;
    let maxTokens = 1000;
    let systemInstruction = 'Você é um assistente de IA especialista em gerar desculpas criativas e convincentes.';
    let activeSettingsId: string | null = null;

    let toneName = params.toneName || 'Padrão';
    let promptTemplateId: string | null = null;
    let userPromptTemplate = 'Gere uma desculpa para o seguinte contexto: "{context}". O tom da desculpa deve ser: "{tone}".';

    try {
      // 1. Load AI Settings
      const settingsRes = await aiSettingsService.getCurrentSettings();
      if (settingsRes.status === 'success' && settingsRes.data) {
        const settings = settingsRes.data;
        activeSettingsId = settings.id;
        temperature = settings.temperature;
        maxTokens = settings.max_tokens;
        systemInstruction = settings.system_prompt;
        defaultModelId = settings.default_model_id;
      }

      // 2. Load Model
      if (defaultModelId && isValidUUID(defaultModelId)) {
        const modelRes = await aiModelsService.getModel(defaultModelId);
        if (modelRes.status === 'success' && modelRes.data) {
          modelIdentifier = modelRes.data.api_identifier;
        }
      }

      // 3. Load Excuse Tone
      if (isValidUUID(params.toneId)) {
        const toneRes = await excuseTonesService.getTone(params.toneId);
        if (toneRes.status === 'success' && toneRes.data) {
          toneName = toneRes.data.name;
        }
      }

      // 4. Load Prompt Template
      const templateRes = await promptTemplatesService.getActiveTemplate('default_generator');
      if (templateRes.status === 'success' && templateRes.data) {
        const template = templateRes.data;
        promptTemplateId = template.id;
        systemInstruction = template.system_prompt;
        userPromptTemplate = template.user_prompt;
      }

      // 5. Build prompt
      const finalPrompt = userPromptTemplate
        .replace('{context}', params.contextInput)
        .replace('{tone}', toneName);

      // 6. Call AI client provider
      const aiProvider = aiClientFactory.getProvider();
      const generatedText = await aiProvider.generate(finalPrompt, modelIdentifier, {
        temperature,
        maxTokens,
        systemInstruction
      });

      const generationTimeMs = Date.now() - startTime;

      // 7. Save successful excuse history record
      const excuseSavedRes = await excusesService.saveExcuse({
        user_id: params.userId,
        input_context: params.contextInput,
        generated_text: generatedText,
        tone_id: params.toneId,
        model_id: defaultModelId || undefined,
        used_temperature: temperature,
        used_max_tokens: maxTokens,
        status: 'success',
        favorite: false,
        generation_time_ms: generationTimeMs,
        prompt_template_id: promptTemplateId || undefined,
        ai_settings_id: activeSettingsId || undefined
      });

      const createdExcuse: Excuse = (excuseSavedRes.status === 'success' && excuseSavedRes.data)
        ? excuseSavedRes.data
        : ({
            id: 'temp-' + Date.now(),
            user_id: params.userId,
            input_context: params.contextInput,
            generated_text: generatedText,
            tone_id: params.toneId,
            used_temperature: temperature,
            used_max_tokens: maxTokens,
            status: 'success',
            favorite: false,
            generation_time_ms: generationTimeMs,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Excuse);

      // 8. Log audit trail (non-blocking)
      auditLogsService.writeLog({
        user_id: params.userId,
        entity: 'excuses',
        entity_id: createdExcuse.id,
        action: 'GERAÇÃO_DE_DESCULPA',
        metadata: {
          tone_name: toneName,
          generation_time_ms: generationTimeMs,
          model: modelIdentifier
        },
        ip_address: params.ipAddress,
        user_agent: params.userAgent
      }).catch(() => {});

      return createSuccessResponse(createdExcuse);

    } catch (error: any) {
      const generationTimeMs = Date.now() - startTime;

      // Log failed attempt to excuses history if possible
      excusesService.saveExcuse({
        user_id: params.userId,
        input_context: params.contextInput,
        generated_text: '',
        tone_id: params.toneId,
        model_id: defaultModelId || undefined,
        used_temperature: temperature,
        used_max_tokens: maxTokens,
        status: 'failed',
        error_message: error.message || String(error),
        generation_time_ms: generationTimeMs,
        prompt_template_id: promptTemplateId || undefined,
        ai_settings_id: activeSettingsId || undefined
      }).catch(() => {});

      // Log audit trail for failure
      auditLogsService.writeLog({
        user_id: params.userId,
        entity: 'excuses',
        action: 'FALHA_GERAÇÃO_DESCULPA',
        metadata: {
          error: error.message || String(error),
          tone_name: toneName
        },
        ip_address: params.ipAddress,
        user_agent: params.userAgent
      }).catch(() => {});

      if (error instanceof ValidationError || error instanceof ConfigurationError || error instanceof AIError) {
        return createErrorResponse(error);
      }

      return createErrorResponse(new AIError(`Falha no pipeline de geração de IA: ${error.message || error}`));
    }
  }
};

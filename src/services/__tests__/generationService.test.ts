import { vi, describe, it, expect, beforeEach } from 'vitest';
import { generationService } from '../generationService';
import { aiSettingsRepository } from '../../repositories/aiSettingsRepository';
import { aiModelsRepository } from '../../repositories/aiModelsRepository';
import { excuseTonesRepository } from '../../repositories/excuseTonesRepository';
import { promptTemplatesRepository } from '../../repositories/promptTemplatesRepository';
import { excusesRepository } from '../../repositories/excusesRepository';
import { auditLogsRepository } from '../../repositories/auditLogsRepository';
import { aiClientFactory } from '../ai/aiClientFactory';

vi.mock('../../repositories/aiSettingsRepository');
vi.mock('../../repositories/aiModelsRepository');
vi.mock('../../repositories/excuseTonesRepository');
vi.mock('../../repositories/promptTemplatesRepository');
vi.mock('../../repositories/excusesRepository');
vi.mock('../../repositories/auditLogsRepository');
vi.mock('../ai/aiClientFactory');

const SETTINGS_ID = '11111111-1111-1111-1111-111111111111';
const MODEL_ID = '22222222-2222-2222-2222-222222222222';
const TONE_ID = '33333333-3333-3333-3333-333333333333';
const TEMPLATE_ID = '44444444-4444-4444-4444-444444444444';
const EXCUSE_ID = '55555555-5555-5555-5555-555555555555';
const USER_ID = '66666666-6666-6666-6666-666666666666';

describe('generationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve executar o pipeline de geracao com sucesso', async () => {
    // mock settings
    vi.mocked(aiSettingsRepository.getLatest).mockResolvedValue({
      id: SETTINGS_ID,
      default_model_id: MODEL_ID,
      temperature: 0.8,
      max_tokens: 500,
      timeout_ms: 15000,
      system_prompt: 'System Prompt Test',
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock model
    vi.mocked(aiModelsRepository.getById).mockResolvedValue({
      id: MODEL_ID,
      provider: 'gemini',
      model_name: 'Gemini 2.5 Flash',
      display_name: 'Gemini 2.5 Flash',
      api_identifier: 'gemini-2.5-flash',
      is_active: true,
      is_deprecated: false,
      sort_order: 1,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock tone
    vi.mocked(excuseTonesRepository.getById).mockResolvedValue({
      id: TONE_ID,
      name: 'Ironico',
      description: 'Tom ironico',
      is_active: true,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock prompt template
    vi.mocked(promptTemplatesRepository.getActiveByName).mockResolvedValue({
      id: TEMPLATE_ID,
      name: 'default_generator',
      version: 1,
      is_active: true,
      description: '',
      system_prompt: 'System instructions',
      user_prompt: 'Excuse for {context} with tone {tone}',
      created_by: null,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock AI Client
    const mockAIClient = {
      generate: vi.fn().mockResolvedValue('Desculpa Gerada pela IA')
    };
    vi.mocked(aiClientFactory.getProvider).mockReturnValue(mockAIClient);

    // mock save excuse
    vi.mocked(excusesRepository.save).mockResolvedValue({
      id: EXCUSE_ID,
      user_id: USER_ID,
      input_context: 'Trabalho atrasado',
      generated_text: 'Desculpa Gerada pela IA',
      tone_id: TONE_ID,
      model_id: MODEL_ID,
      used_temperature: 0.8,
      used_max_tokens: 500,
      status: 'success',
      favorite: false,
      generation_time_ms: 100,
      prompt_template_id: TEMPLATE_ID,
      ai_settings_id: SETTINGS_ID,
      error_message: null,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock audit log
    vi.mocked(auditLogsRepository.log).mockResolvedValue({
      id: '77777777-7777-7777-7777-777777777777',
      user_id: USER_ID,
      entity: 'excuses',
      entity_id: EXCUSE_ID,
      action: 'GERAÇÃO_DE_DESCULPA',
      metadata: {},
      ip_address: null,
      user_agent: null,
      created_at: ''
    });

    const response = await generationService.generateExcuse({
      userId: USER_ID,
      contextInput: 'Trabalho atrasado',
      toneId: TONE_ID
    });

    expect(response.status).toBe('success');
    expect(response.data?.generated_text).toBe('Desculpa Gerada pela IA');
    expect(mockAIClient.generate).toHaveBeenCalledWith(
      'Excuse for Trabalho atrasado with tone Ironico',
      'gemini-2.5-flash',
      expect.objectContaining({
        temperature: 0.8,
        maxTokens: 500
      })
    );
    expect(excusesRepository.save).toHaveBeenCalled();
    expect(auditLogsRepository.log).toHaveBeenCalled();
  });

  it('deve registrar falha no historico em caso de erro na geracao', async () => {
    // mock settings
    vi.mocked(aiSettingsRepository.getLatest).mockResolvedValue({
      id: SETTINGS_ID,
      default_model_id: MODEL_ID,
      temperature: 0.8,
      max_tokens: 500,
      timeout_ms: 15000,
      system_prompt: 'System Prompt Test',
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock model
    vi.mocked(aiModelsRepository.getById).mockResolvedValue({
      id: MODEL_ID,
      provider: 'gemini',
      model_name: 'Gemini 2.5 Flash',
      display_name: 'Gemini 2.5 Flash',
      api_identifier: 'gemini-2.5-flash',
      is_active: true,
      is_deprecated: false,
      sort_order: 1,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock tone
    vi.mocked(excuseTonesRepository.getById).mockResolvedValue({
      id: TONE_ID,
      name: 'Ironico',
      description: 'Tom ironico',
      is_active: true,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock prompt template
    vi.mocked(promptTemplatesRepository.getActiveByName).mockResolvedValue({
      id: TEMPLATE_ID,
      name: 'default_generator',
      version: 1,
      is_active: true,
      description: '',
      system_prompt: 'System instructions',
      user_prompt: 'Excuse for {context} with tone {tone}',
      created_by: null,
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock AI Client throwing error
    const mockAIClient = {
      generate: vi.fn().mockRejectedValue(new Error('Gemini API limit exceeded'))
    };
    vi.mocked(aiClientFactory.getProvider).mockReturnValue(mockAIClient);

    // mock save excuse (failed status)
    vi.mocked(excusesRepository.save).mockResolvedValue({
      id: '88888888-8888-8888-8888-888888888888',
      user_id: USER_ID,
      input_context: 'Trabalho atrasado',
      generated_text: '',
      tone_id: TONE_ID,
      model_id: MODEL_ID,
      used_temperature: 0.8,
      used_max_tokens: 500,
      status: 'failed',
      favorite: false,
      generation_time_ms: 100,
      prompt_template_id: TEMPLATE_ID,
      ai_settings_id: SETTINGS_ID,
      error_message: 'Gemini API limit exceeded',
      created_at: '',
      updated_at: '',
      deleted_at: null
    });

    // mock audit log for failure
    vi.mocked(auditLogsRepository.log).mockResolvedValue({
      id: '99999999-9999-9999-9999-999999999999',
      user_id: USER_ID,
      entity: 'excuses',
      entity_id: '88888888-8888-8888-8888-888888888888',
      action: 'FALHA_GERAÇÃO_DESCULPA',
      metadata: {},
      ip_address: null,
      user_agent: null,
      created_at: ''
    });

    const response = await generationService.generateExcuse({
      userId: USER_ID,
      contextInput: 'Trabalho atrasado',
      toneId: TONE_ID
    });

    expect(response.status).toBe('error');
    expect(excusesRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      status: 'failed',
      error_message: expect.stringContaining('Gemini API limit exceeded')
    }));
    expect(auditLogsRepository.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'FALHA_GERAÇÃO_DESCULPA'
    }));
  });
});

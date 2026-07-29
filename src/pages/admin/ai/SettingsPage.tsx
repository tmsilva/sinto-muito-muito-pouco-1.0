import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSettingsService } from '../../../services/aiSettingsService';
import { aiModelsService } from '../../../services/aiModelsService';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import type { AISettings, AIModel } from '../../../types/domain.types';

// Custom UI Components
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  Dialog,
  LoadingState,
  Stack,
  Flex,
  Divider
} from '../../../components/ui';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [defaultModelId, setDefaultModelId] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(1000);
  const [timeoutMs, setTimeoutMs] = useState<number>(30000);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  // Dialog Confirmations
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);

  // Queries
  const { data: settings, isLoading: settingsLoading, refetch } = useQuery<AISettings | null>({
    queryKey: ['ai-settings'],
    queryFn: async () => {
      const res = await aiSettingsService.getCurrentSettings();
      if (res.status === 'error') throw res.error;
      return res.data;
    }
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery<AIModel[]>({
    queryKey: ['ai-models-active'],
    queryFn: async () => {
      const res = await aiModelsService.listActive();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  // Sync state with query result
  useEffect(() => {
    if (settings) {
      setDefaultModelId(settings.default_model_id || '');
      setTemperature(settings.temperature ?? 0.7);
      setMaxTokens(settings.max_tokens ?? 1000);
      setTimeoutMs(settings.timeout_ms ?? 30000);
      setSystemPrompt(settings.system_prompt || '');
    }
  }, [settings]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload: any) => aiSettingsService.saveSettings(payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Configurações salvas com sucesso!', 'success');
        queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao salvar configurações.', 'error');
      }
    }
  });

  const handleSave = () => {
    if (!defaultModelId) {
      addToast('Por favor, selecione um modelo padrão.', 'warning');
      return;
    }

    saveMutation.mutate({
      id: settings?.id,
      default_model_id: defaultModelId,
      temperature,
      max_tokens: maxTokens,
      timeout_ms: timeoutMs,
      system_prompt: systemPrompt
    });
  };

  const handleResetDefaults = () => {
    // Standard recommended parameters
    const defaultModel = models.find(m => m.provider === 'google') || models[0];
    setDefaultModelId(defaultModel?.id || '');
    setTemperature(0.7);
    setMaxTokens(1000);
    setTimeoutMs(30000);
    setSystemPrompt('Você é um assistente de IA especialista em gerar desculpas criativas e convincentes.');
    setResetConfirmOpen(false);
    addToast('Parâmetros restaurados para o padrão sugerido.', 'info');
  };

  if (settingsLoading || modelsLoading) {
    return <LoadingState message="Carregando configurações de IA..." />;
  }

  const modelOptions = models.map((m) => ({
    value: m.id,
    label: `${m.display_name} (${m.provider.toUpperCase()})`
  }));

  return (
    <Container size="md">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Globais de IA</CardTitle>
          <CardDescription>
            Ajuste os parâmetros de orquestração do Gemini/LLMs e as instruções de sistema globais.
          </CardDescription>
        </CardHeader>
        <Divider />
        <CardBody>
          <Stack gap={5}>
            {/* Default Model */}
            <Select
              label="Modelo de Linguagem Padrão"
              value={defaultModelId}
              onChange={(e) => setDefaultModelId(e.target.value)}
              options={modelOptions}
            />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'calc(-1 * var(--spacing-3))' }}>
              Define qual inteligência processará a geração de desculpas quando nenhum modelo específico for solicitado.
            </span>

            {/* Temperature */}
            <div>
              <Flex justify="between" align="center" style={{ marginBottom: 'var(--spacing-2)' }}>
                <label className="input-label" style={{ margin: 0 }}>Temperatura: {temperature.toFixed(1)}</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={temperature}
                  onChange={(e) => setTemperature(Math.max(0, Math.min(2, Number(e.target.value))))}
                  style={{ width: '80px', padding: 'var(--spacing-1) var(--spacing-2)', height: 'auto', fontSize: 'var(--font-size-xs)' }}
                />
              </Flex>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-1)' }}>
                Valores menores geram desculpas mais realistas e corporativas. Valores maiores geram textos irônicos e dramáticos.
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <Flex justify="between" align="center" style={{ marginBottom: 'var(--spacing-2)' }}>
                <label className="input-label" style={{ margin: 0 }}>Limite de Tokens: {maxTokens}</label>
                <Input
                  type="number"
                  step="50"
                  min="100"
                  max="4000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Math.max(100, Math.min(4000, Number(e.target.value))))}
                  style={{ width: '80px', padding: 'var(--spacing-1) var(--spacing-2)', height: 'auto', fontSize: 'var(--font-size-xs)' }}
                />
              </Flex>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-1)' }}>
                Tamanho máximo tolerado para a resposta gerada. Uma desculpa normal raramente excede 300 tokens.
              </div>
            </div>

            {/* Timeout */}
            <Input
              type="number"
              label="Timeout da Requisição (milissegundos)"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(Number(e.target.value))}
            />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'calc(-1 * var(--spacing-3))' }}>
              Tempo limite para aguardar o retorno da API de Inteligência Artificial antes de retornar erro. Recomendado: 30000ms.
            </span>

            {/* System Prompt */}
            <Textarea
              label="Prompt de Instrução do Sistema (System Prompt)"
              placeholder="Instruções fundamentais de personalidade do robô..."
              value={systemPrompt}
              onChange={(e: any) => setSystemPrompt(e.target.value)}
              style={{ minHeight: '120px' }}
            />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'calc(-1 * var(--spacing-3))' }}>
              Determina o comportamento base, idioma preferencial, restrições éticas e estilo de oratória adotado pela IA.
            </span>

            {settings?.updated_at && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Última atualização: {new Date(settings.updated_at).toLocaleString()}
              </span>
            )}

            <Divider />

            <Flex justify="between" align="center">
              <Button variant="secondary" onClick={() => setResetConfirmOpen(true)}>
                Restaurar Padrões
              </Button>
              <Flex gap={3}>
                <Button variant="secondary" onClick={() => refetch()}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} isLoading={saveMutation.isPending}>
                  Salvar Alterações
                </Button>
              </Flex>
            </Flex>
          </Stack>
        </CardBody>
      </Card>

      {/* CONFIRM RESET DIALOG */}
      <Dialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetDefaults}
        title="Restaurar Parâmetros Padrão"
        description="Tem certeza que deseja carregar as configurações recomendadas? Suas alterações não salvas serão perdidas."
        confirmText="Restaurar"
        cancelText="Cancelar"
      />
    </Container>
  );
};
export default SettingsPage;

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { aiModelsService } from '../../../services/aiModelsService';
import { excuseTonesService } from '../../../services/excuseTonesService';
import { promptTemplatesService } from '../../../services/promptTemplatesService';
import { generationService } from '../../../services/generationService';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import type { AIModel, ExcuseTone, PromptTemplate } from '../../../types/domain.types';

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Button,
  Textarea,
  Select,
  LoadingState,
  Stack,
  Flex,
  Divider,
  Grid
} from '../../../components/ui';
export const PlaygroundPage: React.FC = () => {
  const { addToast } = useToast();

  // Test Configurations State
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedToneId, setSelectedToneId] = useState<string>('');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('default_generator');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [contextInput, setContextInput] = useState<string>('Esqueci minha carteira em casa e não tenho como pagar a conta do restaurante');

  // Response/Execution metrics state
  const [testResult, setTestResult] = useState<string>('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [executing, setExecuting] = useState<boolean>(false);

  // Queries
  const { data: models = [], isLoading: modelsLoading } = useQuery<AIModel[]>({
    queryKey: ['ai-models-active'],
    queryFn: async () => {
      const res = await aiModelsService.listActive();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  const { data: tones = [], isLoading: tonesLoading } = useQuery<ExcuseTone[]>({
    queryKey: ['excuse-tones-active'],
    queryFn: async () => {
      const res = await excuseTonesService.listActiveTones();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery<PromptTemplate[]>({
    queryKey: ['prompt-templates-active'],
    queryFn: async () => {
      const res = await promptTemplatesService.listTemplates();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  // Init selections once data is fetched
  React.useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      setSelectedModelId(models[0].id);
    }
    if (tones.length > 0 && !selectedToneId) {
      setSelectedToneId(tones[0].id);
    }
  }, [models, tones]);

  const handleExecute = async () => {
    if (!contextInput.trim()) {
      addToast('Por favor, informe um contexto para teste.', 'warning');
      return;
    }

    setExecuting(true);
    setTestResult('');
    const startTime = Date.now();

    try {
      const selectedTone = tones.find(t => t.id === selectedToneId);
      
      const res = await generationService.generateExcuse({
        contextInput: contextInput.trim(),
        toneId: selectedToneId,
        toneName: selectedTone?.name || 'Sincero'
      });

      setTestLatency(Date.now() - startTime);

      if (res.status === 'success' && res.data) {
        setTestResult(res.data.generated_text);
        addToast('Geração do playground executada!', 'success');
      } else {
        setTestResult(`Erro de execução:\n${res.error?.friendlyMessage || 'Erro desconhecido.'}`);
        addToast('Falha na geração do playground.', 'error');
      }
    } catch (err: any) {
      setTestResult(`Erro inesperado:\n${err.message}`);
      setTestLatency(Date.now() - startTime);
    } finally {
      setExecuting(false);
    }
  };

  if (modelsLoading || tonesLoading || templatesLoading) {
    return <LoadingState message="Preparando ambiente de testes do Playground..." />;
  }

  const modelOptions = models.map(m => ({ value: m.id, label: `${m.display_name} (${m.provider.toUpperCase()})` }));
  const toneOptions = tones.map(t => ({ value: t.id, label: t.name }));
  const templateOptions = templates.map(t => ({ value: t.name, label: t.name }));

  return (
    <Container size="lg">
      <Card>
        <CardHeader>
          <CardTitle>Playground de Inteligência Artificial</CardTitle>
          <CardDescription>
            Simule e valide a geração de desculpas em tempo real ajustando hiperparâmetros de forma isolada.
          </CardDescription>
        </CardHeader>
        <Divider />
        <CardBody>
          <Grid cols={1} mdCols={3} gap={6}>
            {/* CONFIGURATION SIDEBAR */}
            <Stack gap={5} style={{ gridColumn: 'span 1' }}>
              <h4>Configurações de Teste</h4>
              
              <Select
                label="Modelo de IA"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                options={modelOptions}
              />

              <Select
                label="Tom de Desculpa"
                value={selectedToneId}
                onChange={(e) => setSelectedToneId(e.target.value)}
                options={toneOptions}
              />

              <Select
                label="Template de Prompt"
                value={selectedTemplateName}
                onChange={(e) => setSelectedTemplateName(e.target.value)}
                options={templateOptions}
              />

              <div>
                <Flex justify="between" align="center" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <label className="input-label" style={{ margin: 0 }}>Temperatura: {temperature.toFixed(1)}</label>
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
              </div>

              <Textarea
                label="Contexto da Enrascada"
                value={contextInput}
                onChange={(e: any) => setContextInput(e.target.value)}
                style={{ minHeight: '80px' }}
              />

              <Button onClick={handleExecute} isLoading={executing}>
                Gerar Desculpa no Playground
              </Button>
            </Stack>
            {/* RESULTS VIEWPORT */}
            <Stack gap={5} style={{ gridColumn: 'span 2' }}>
              <h4>Resultado do Processamento</h4>
              {executing ? (
                <LoadingState message="Aguardando retorno da API..." />
              ) : testResult ? (
                <Stack gap={4}>
                  <div>
                    <label className="input-label">Texto Retornado:</label>
                    <div style={{
                      background: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      padding: 'var(--spacing-4)',
                      borderRadius: 'var(--radius-md)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {testResult}
                    </div>
                  </div>

                  <Grid cols={2} gap={4}>
                    <Card style={{ padding: 'var(--spacing-3)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Latência</span>
                      <h3 style={{ margin: 'var(--spacing-1) 0 0 0', color: 'var(--color-accent)' }}>
                        {testLatency} ms
                      </h3>
                    </Card>
                    <Card style={{ padding: 'var(--spacing-3)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Status de Execução</span>
                      <h3 style={{ margin: 'var(--spacing-1) 0 0 0', color: 'var(--color-success)' }}>
                        Sucesso
                      </h3>
                    </Card>
                  </Grid>
                </Stack>
              ) : (
                <div style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  Configure os parâmetros ao lado e clique em gerar para ver o resultado do processamento.
                </div>
              )}
            </Stack>
          </Grid>
        </CardBody>
      </Card>
    </Container>
  );
};
export default PlaygroundPage;

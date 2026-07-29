import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiModelsService } from '../../../services/aiModelsService';
import { aiSettingsService } from '../../../services/aiSettingsService';
import { aiClientFactory } from '../../../services/ai/aiClientFactory';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import type { AIModel } from '../../../types/domain.types';

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
  Checkbox,
  Select,
  Badge,
  Modal,
  Dialog,
  LoadingState,
  EmptyState,
  Stack,
  Flex,
  Divider
} from '../../../components/ui';

// Custom Icons
import {
  EditIcon,
  TrashIcon
} from '../../../components/icons';
export const ModelsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  
  // Form State
  const [displayName, setDisplayName] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [apiIdentifier, setApiIdentifier] = useState<string>('');
  const [provider, setProvider] = useState<string>('google');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDeprecated, setIsDeprecated] = useState<boolean>(false);
  const [contextWindow, setContextWindow] = useState<number>(32768);
  const [maxTokensLimit, setMaxTokensLimit] = useState<number>(8192);
  const [sortOrder, setSortOrder] = useState<number>(1);

  // Test Drawer State
  const [testDrawerOpen, setTestDrawerOpen] = useState<boolean>(false);
  const [testingModel, setTestingModel] = useState<AIModel | null>(null);
  const [testPrompt, setTestPrompt] = useState<string>('Olá, responda com uma piada curta de programador.');
  const [testResult, setTestResult] = useState<string>('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null);

  // Queries
  const { data: models = [], isLoading, isError, error, refetch } = useQuery<AIModel[]>({
    queryKey: ['ai-models'],
    queryFn: async () => {
      const res = await aiModelsService.listAll();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  const { data: globalSettings } = useQuery({
    queryKey: ['ai-settings'],
    queryFn: async () => {
      const res = await aiSettingsService.getCurrentSettings();
      if (res.status === 'error') throw res.error;
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => aiModelsService.createModel(payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Modelo criado com sucesso!', 'success');
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao criar modelo.', 'error');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => aiModelsService.updateModel(id, payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Modelo atualizado com sucesso!', 'success');
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao atualizar modelo.', 'error');
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => aiModelsService.deleteModel(id),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Modelo removido com sucesso!', 'success');
        setDeleteDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao remover modelo.', 'error');
      }
    }
  });

  const seedMutation = useMutation({
    mutationFn: () => aiModelsService.seedDefaultModels(),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Modelos padrão populados com sucesso!', 'success');
        queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao popular modelos.', 'error');
      }
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (modelId: string) => {
      if (!globalSettings) throw new Error('Configurações globais não carregadas.');
      return aiSettingsService.saveSettings({
        id: globalSettings.id,
        default_model_id: modelId,
        temperature: globalSettings.temperature,
        max_tokens: globalSettings.max_tokens,
        timeout_ms: globalSettings.timeout_ms,
        system_prompt: globalSettings.system_prompt
      });
    },
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Modelo padrão alterado com sucesso!', 'success');
        queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao alterar modelo padrão.', 'error');
      }
    }
  });

  // Actions
  const handleOpenCreate = () => {
    setEditingModel(null);
    setDisplayName('');
    setModelName('');
    setApiIdentifier('');
    setProvider('google');
    setIsActive(true);
    setIsDeprecated(false);
    setContextWindow(32768);
    setMaxTokensLimit(8192);
    setSortOrder(models.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (model: AIModel) => {
    setEditingModel(model);
    setDisplayName(model.display_name);
    setModelName(model.model_name);
    setApiIdentifier(model.api_identifier);
    setProvider(model.provider);
    setIsActive(model.is_active);
    setIsDeprecated(model.is_deprecated);
    setContextWindow(model.context_window || 32768);
    setMaxTokensLimit(model.max_tokens_limit || 8192);
    setSortOrder(model.sort_order || 1);
    setModalOpen(true);
  };

  const handleSaveModel = () => {
    const payload = {
      display_name: displayName,
      model_name: modelName,
      api_identifier: apiIdentifier,
      provider: provider,
      is_active: isActive,
      is_deprecated: isDeprecated,
      context_window: contextWindow,
      max_tokens_limit: maxTokensLimit,
      sort_order: sortOrder
    };

    if (editingModel) {
      updateMutation.mutate({ id: editingModel.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDuplicate = (model: AIModel) => {
    createMutation.mutate({
      display_name: `${model.display_name} (Cópia)`,
      model_name: model.model_name,
      api_identifier: `${model.api_identifier}-copy`,
      provider: model.provider,
      is_active: model.is_active,
      is_deprecated: model.is_deprecated,
      context_window: model.context_window,
      max_tokens_limit: model.max_tokens_limit,
      sort_order: (model.sort_order || 0) + 1
    });
  };

  const handleToggleActive = (model: AIModel) => {
    updateMutation.mutate({
      id: model.id,
      payload: { is_active: !model.is_active }
    });
  };

  const handleTestModel = async () => {
    if (!testingModel) return;
    setTestLoading(true);
    setTestResult('');
    const startTime = Date.now();
    try {
      // Direct call to GeminiAIClient or current factory provider
      const client = aiClientFactory.getProvider();
      const text = await client.generate(testPrompt, testingModel.api_identifier, {
        temperature: 0.7,
        maxTokens: 200
      });
      setTestLatency(Date.now() - startTime);
      setTestResult(text);
      addToast('Teste do modelo finalizado!', 'success');
    } catch (err: any) {
      setTestResult(`Erro durante a chamada do modelo:\n${err.message}`);
      setTestLatency(Date.now() - startTime);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Container size="lg">
      <Card>
        <CardHeader>
          <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-4)' }}>
            <div>
              <CardTitle>Modelos de Inteligência Artificial</CardTitle>
              <CardDescription>
                Gerencie os provedores e conectores de LLM suportados no ecossistema da aplicação.
              </CardDescription>
            </div>
            <Flex gap={2}>
              <Button variant="secondary" onClick={() => seedMutation.mutate()} isLoading={seedMutation.isPending}>
                Popular Padrões
              </Button>
              <Button onClick={handleOpenCreate}>+ Adicionar Modelo</Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <LoadingState message="Carregando modelos do Supabase..." />
          ) : isError ? (
            <EmptyState 
              title="Erro ao obter modelos" 
              description={error?.message || 'Erro inesperado de rede.'}
              action={<Button onClick={() => refetch()}>Tentar Novamente</Button>}
            />
          ) : models.length === 0 ? (
            <EmptyState 
              title="Nenhum modelo cadastrado" 
              description="Adicione seu primeiro modelo do Gemini ou OpenAI para começar."
              action={<Button onClick={handleOpenCreate}>+ Criar Primeiro Modelo</Button>}
            />
          ) : (
            <Stack gap={3}>
              {models.map((m) => {
                const isDefault = globalSettings?.default_model_id === m.id;
                return (
                  <Card key={m.id} style={{ padding: 'var(--spacing-4)' }}>
                    <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-3)' }}>
                      <Stack gap={1}>
                        <Flex align="center" gap={2}>
                          <span style={{ fontWeight: 'bold' }}>{m.display_name}</span>
                          <Badge variant={m.provider === 'google' ? 'success' : 'default'}>
                            {m.provider.toUpperCase()}
                          </Badge>
                          {isDefault && <Badge variant="warning">Padrão</Badge>}
                          {!m.is_active && <Badge variant="danger">Inativo</Badge>}
                        </Flex>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Identificador: {m.api_identifier} | Contexto: {m.context_window?.toLocaleString() || '32.768'} tokens
                        </span>
                      </Stack>
                      <Flex align="center" gap={2}>
                        <Button size="sm" variant="ghost" onClick={() => { setTestingModel(m); setTestResult(''); setTestPrompt('Olá, responda com uma piada curta.'); setTestDrawerOpen(true); }}>
                          Testar
                        </Button>
                        {!isDefault && m.is_active && (
                          <Button size="sm" variant="secondary" onClick={() => setDefaultMutation.mutate(m.id)}>
                            Definir Padrão
                          </Button>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => handleToggleActive(m)}>
                          {m.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleDuplicate(m)}>
                          Duplicar
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(m)}>
                          <EditIcon size={14} />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => { setModelToDelete(m); setDeleteDialogOpen(true); }}>
                          <TrashIcon size={14} />
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardBody>
      </Card>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingModel ? 'Editar Modelo de IA' : 'Novo Modelo de IA'}
        footer={
          <Stack direction="horizontal" gap={3} justify="end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveModel} isLoading={createMutation.isPending || updateMutation.isPending}>Salvar</Button>
          </Stack>
        }
      >
        <Stack gap={4}>
          <Input label="Nome de Exibição" placeholder="Ex: Gemini 2.5 Pro" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="Código do Modelo (Supabase/Internal)" placeholder="Ex: gemini-2.5-pro" value={modelName} onChange={(e) => setModelName(e.target.value)} />
          <Input label="Identificador de API (Provider API ID)" placeholder="Ex: gemini-2.5-pro-latest" value={apiIdentifier} onChange={(e) => setApiIdentifier(e.target.value)} />
          
          <Select
            label="Provedor"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            options={[
              { value: 'google', label: 'Google Gemini' },
              { value: 'openai', label: 'OpenAI GPT' },
              { value: 'anthropic', label: 'Anthropic Claude' },
              { value: 'groq', label: 'Groq Cloud' },
              { value: 'ollama', label: 'Ollama Local' }
            ]}
          />

          <Stack direction="horizontal" gap={4}>
            <Input type="number" label="Janela de Contexto (tokens)" value={contextWindow} onChange={(e) => setContextWindow(Number(e.target.value))} />
            <Input type="number" label="Limite de Max Tokens" value={maxTokensLimit} onChange={(e) => setMaxTokensLimit(Number(e.target.value))} />
          </Stack>

          <Input type="number" label="Ordem de Exibição" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />

          <Stack gap={2}>
            <Checkbox label="Modelo Ativo" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <Checkbox label="Depreciado (Ignorado no pipeline)" checked={isDeprecated} onChange={(e) => setIsDeprecated(e.target.checked)} />
          </Stack>
        </Stack>
      </Modal>
      {/* TEST MODEL DRAWER */}
      {testDrawerOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setTestDrawerOpen(false)}
        >
          <div 
            style={{
              width: '450px',
              height: '100%',
              background: 'var(--color-background-card)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--spacing-6)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack gap={4} style={{ flex: 1 }}>
              <h3>Testar Conectividade: {testingModel?.display_name}</h3>
              <Textarea
                label="Prompt de Teste"
                value={testPrompt}
                onChange={(e: any) => setTestPrompt(e.target.value)}
                disabled={testLoading}
              />
              <Button onClick={handleTestModel} isLoading={testLoading}>Executar Chamada</Button>

              {testLatency !== null && (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Tempo de Resposta: <strong style={{ color: 'var(--color-accent)' }}>{testLatency} ms</strong>
                </span>
              )}

              {testResult && (
                <div>
                  <label className="input-label">Retorno da API:</label>
                  <pre style={{
                    background: 'var(--color-background)',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    fontSize: 'var(--font-size-xs)',
                    border: '1px solid var(--color-border)',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--color-text-muted)'
                  }}>
                    {testResult}
                  </pre>
                </div>
              )}
            </Stack>
          </div>
        </div>
      )}

      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => modelToDelete && deleteMutation.mutate(modelToDelete.id)}
        title="Remover Modelo"
        description={`Tem certeza que deseja remover permanentemente o modelo "${modelToDelete?.display_name}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Container>
  );
};
export default ModelsPage;

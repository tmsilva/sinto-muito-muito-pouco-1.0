import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptTemplatesService } from '../../../services/promptTemplatesService';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import type { PromptTemplate } from '../../../types/domain.types';

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
  Modal,
  Dialog,
  LoadingState,
  Stack,
  Flex,
  Divider,
  Grid
} from '../../../components/ui';

// Custom Icons
import {
  EditIcon,
  TrashIcon
} from '../../../components/icons';
export const PromptsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');

  // Sample Context for Preview
  const sampleContext = 'Esqueci o relatório de fechamento mensal que meu gerente pediu ontem';
  const sampleTone = 'Corporativo';

  // Queries
  const { data: templates = [], isLoading } = useQuery<PromptTemplate[]>({
    queryKey: ['prompt-templates'],
    queryFn: async () => {
      const res = await promptTemplatesService.listTemplates();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  // Query versions for the active editing template family
  const { data: versions = [] } = useQuery<PromptTemplate[]>({
    queryKey: ['prompt-versions', editingTemplate?.name],
    queryFn: async () => {
      if (!editingTemplate) return [];
      const res = await promptTemplatesService.listVersions(editingTemplate.name);
      if (res.status === 'error') throw res.error;
      return res.data || [];
    },
    enabled: !!editingTemplate
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => promptTemplatesService.createTemplateVersion(payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Nova versão de prompt publicada!', 'success');
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao salvar prompt.', 'error');
      }
    }
  });

  const seedMutation = useMutation({
    mutationFn: () => promptTemplatesService.seedDefaultTemplates(),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Templates padrão populados!', 'success');
        queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao popular templates.', 'error');
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (templateName: string) => promptTemplatesService.deleteTemplate(templateName),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Template excluído com sucesso!', 'success');
        queryClient.invalidateQueries({ queryKey: ['prompt-templates'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao excluir template.', 'error');
      }
    }
  });

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setName('');
    setDescription('');
    setSystemPrompt('');
    setUserPrompt('');
    setModalOpen(true);
  };

  const handleOpenEdit = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setDescription(template.description || '');
    setSystemPrompt(template.system_prompt);
    setUserPrompt(template.user_prompt);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      addToast('O nome do template é obrigatório.', 'warning');
      return;
    }
    // Determine the next version number
    const currentMaxVersion = versions.length > 0 ? Math.max(...versions.map(v => v.version)) : (editingTemplate?.version || 0);
    saveMutation.mutate({
      name: name.trim(),
      version: currentMaxVersion + 1,
      is_active: true,
      description: description.trim(),
      system_prompt: systemPrompt.trim(),
      user_prompt: userPrompt.trim()
    });
  };

  const handleRollback = (pastVersion: PromptTemplate) => {
    setSystemPrompt(pastVersion.system_prompt);
    setUserPrompt(pastVersion.user_prompt);
    setDescription(`Restaurado da versão v${pastVersion.version}`);
    addToast(`Conteúdo da versão v${pastVersion.version} carregado no formulário.`, 'info');
  };

  // Preview Prompt Rendering
  const renderedPromptPreview = userPrompt
    .replace('{context}', sampleContext)
    .replace('{tone}', sampleTone);

  return (
    <Container size="lg">
      <Card>
        <CardHeader>
          <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-4)' }}>
            <div>
              <CardTitle>Templates de Prompt da IA</CardTitle>
              <CardDescription>
                Defina o comportamento e o formato do texto gerado pela Inteligência Artificial.
              </CardDescription>
            </div>
            <Flex gap={2}>
              <Button variant="secondary" onClick={() => seedMutation.mutate()} isLoading={seedMutation.isPending}>
                Popular Padrões
              </Button>
              <Button onClick={handleOpenCreate}>+ Adicionar Template</Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <LoadingState message="Carregando templates..." />
          ) : templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
              Nenhum prompt template encontrado.
            </div>
          ) : (
            <Stack gap={3}>
              {templates.map((t) => (
                <Card key={t.id} style={{ padding: 'var(--spacing-4)' }}>
                  <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-3)' }}>
                    <Stack gap={1}>
                      <Flex align="center" gap={2}>
                        <span style={{ fontWeight: 'bold' }}>{t.name}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-background-hover)', padding: '2px 6px', borderRadius: '4px' }}>
                          Versão v{t.version}
                        </span>
                      </Flex>
                      {t.description && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {t.description}
                        </span>
                      )}
                    </Stack>
                    <Flex gap={2}>
                      <Button size="sm" onClick={() => handleOpenEdit(t)}>
                        <EditIcon size={14} style={{ marginRight: '6px' }} /> Editar & Ver Histórico
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => {
                        setSelectedTemplateName(t.name);
                        setDeleteDialogOpen(true);
                      }}>
                        <TrashIcon size={14} style={{ marginRight: '6px' }} /> Excluir
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Stack>
          )}
        </CardBody>
      </Card>

      {/* EDIT TEMPLATE SPLIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Editor de Prompt: ${editingTemplate?.name}`}
        footer={
          <Stack direction="horizontal" gap={3} justify="end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={saveMutation.isPending}>Publicar Como Nova Versão</Button>
          </Stack>
        }
      >
        <div style={{ width: '850px', maxWidth: '100%' }}>
          <Grid cols={1} mdCols={2} gap={6}>
          <Stack gap={4}>
            <h4>Configuração do Template</h4>
            <Input label="Identificador do Template" value={name} onChange={(e) => setName(e.target.value)} disabled={!!editingTemplate} />
            <Input label="Descrição das Modificações" placeholder="Ex: Ajustando tom de desculpas corporativas..." value={description} onChange={(e) => setDescription(e.target.value)} />
            
            <Textarea
              label="System Prompt"
              placeholder="Instruções fundamentais..."
              value={systemPrompt}
              onChange={(e: any) => setSystemPrompt(e.target.value)}
              style={{ minHeight: '120px' }}
            />

            <Textarea
              label="User Prompt Template"
              placeholder="Ex: Gere uma desculpa sobre {context} no tom {tone}..."
              value={userPrompt}
              onChange={(e: any) => setUserPrompt(e.target.value)}
              style={{ minHeight: '100px' }}
            />

            <div>
              <div className="input-label" style={{ marginBottom: 'var(--spacing-1)' }}>Variáveis Disponíveis:</div>
              <Flex gap={2}>
                <code>{"{context}"}</code>
                <code>{"{tone}"}</code>
              </Flex>
            </div>
          </Stack>

          {/* RIGHT PANEL - LIVE PREVIEW & TIMELINE */}
          <Stack gap={4}>
            <h4>Visualização & Histórico</h4>
            
            <div>
              <div className="input-label">Prompt Final Renderizado (Exemplo):</div>
              <div style={{
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                maxHeight: '120px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {renderedPromptPreview}
              </div>
            </div>

            <div>
              <div className="input-label">Timeline de Versões:</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {versions.map((v) => (
                  <div 
                    key={v.id} 
                    style={{ 
                      padding: 'var(--spacing-2) var(--spacing-3)', 
                      background: 'var(--color-background)', 
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Stack gap={1}>
                      <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-xs)' }}>Versão v{v.version}</span>
                      {v.description && <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{v.description}</span>}
                    </Stack>
                    <Button size="sm" variant="ghost" onClick={() => handleRollback(v)}>
                      Restaurar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Stack>
        </Grid>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate(selectedTemplateName);
          setDeleteDialogOpen(false);
        }}
        isConfirmLoading={deleteMutation.isPending}
        title="Excluir Template de Prompt"
        description={`Tem certeza que deseja excluir o template "${selectedTemplateName}"? Esta ação removerá todas as versões associadas.`}
        confirmText="Excluir permanentemente"
        cancelText="Cancelar"
      />
    </Container>
  );
};
export default PromptsPage;

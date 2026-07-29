import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { excuseTonesService } from '../../../services/excuseTonesService';
import { useToast } from '../../../components/ui/Toast/ToastContext';
import type { ExcuseTone } from '../../../types/domain.types';

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
  Modal,
  Checkbox,
  Badge,
  LoadingState,
  EmptyState,
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

const TONE_PREVIEWS: Record<string, string> = {
  Sincero: 'Estou cansado e prefiro passar o final de semana debaixo das cobertas assistindo série.',
  Irônico: 'Fui aconselhado pelo meu comitê de sanidade mental a não sair de casa hoje. Desculpe!',
  Corporativo: 'Devido a conflitos imprevistos na minha agenda operacional, não poderei participar do evento.',
  Dramático: 'Uma tempestade de cansaço emocional desabou sobre mim, impossibilitando qualquer locomoção.',
  Minimalista: 'Não vou poder ir.'
};

export const TonesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTone, setEditingTone] = useState<ExcuseTone | null>(null);
  // Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  // Queries
  const { data: tones = [], isLoading } = useQuery<ExcuseTone[]>({
    queryKey: ['excuse-tones'],
    queryFn: async () => {
      const res = await excuseTonesService.listAllTones();
      if (res.status === 'error') throw res.error;
      return res.data || [];
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => excuseTonesService.createTone(payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Tom criado com sucesso!', 'success');
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['excuse-tones'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao criar tom.', 'error');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => excuseTonesService.updateTone(id, payload),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Tom atualizado com sucesso!', 'success');
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['excuse-tones'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao atualizar tom.', 'error');
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => excuseTonesService.deleteTone(id),
    onSuccess: (res) => {
      if (res.status === 'success') {
        addToast('Tom removido com sucesso!', 'success');
        queryClient.invalidateQueries({ queryKey: ['excuse-tones'] });
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao remover tom.', 'error');
      }
    }
  });

  const handleOpenCreate = () => {
    setEditingTone(null);
    setName('');
    setDescription('');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (tone: ExcuseTone) => {
    setEditingTone(tone);
    setName(tone.name);
    setDescription(tone.description || '');
    setIsActive(tone.is_active);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      addToast('O nome do tom é obrigatório.', 'warning');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      is_active: isActive
    };

    if (editingTone) {
      updateMutation.mutate({ id: editingTone.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleActive = (tone: ExcuseTone) => {
    updateMutation.mutate({
      id: tone.id,
      payload: { is_active: !tone.is_active }
    });
  };

  return (
    <Container size="lg">
      <Card>
        <CardHeader>
          <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-4)' }}>
            <div>
              <CardTitle>Tons de Desculpas</CardTitle>
              <CardDescription>
                Gerencie as abordagens linguísticas disponíveis no painel de geração da tela inicial.
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate}>+ Adicionar Tom</Button>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <LoadingState message="Carregando tons..." />
          ) : tones.length === 0 ? (
            <EmptyState
              title="Nenhum tom encontrado"
              description="Crie o primeiro tom para liberar a escolha na tela inicial."
              action={<Button onClick={handleOpenCreate}>+ Adicionar Tom</Button>}
            />
          ) : (
            <Grid cols={1} mdCols={2} gap={4}>
              {tones.map((t) => (
                <Card key={t.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardHeader style={{ paddingBottom: 0 }}>
                    <Flex justify="between" align="center">
                      <Flex align="center" gap={2}>
                        <span style={{ fontSize: '1.25rem' }}>🎭</span>
                        <CardTitle style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>{t.name}</CardTitle>
                      </Flex>
                      <Badge variant={t.is_active ? 'success' : 'default'}>
                        {t.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody style={{ flex: 1 }}>
                    <Stack gap={3}>
                      {t.description && (
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                          {t.description}
                        </p>
                      )}
                      <div>
                        <div className="input-label" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Preview Simulado:</div>
                        <div style={{
                          background: 'var(--color-background)',
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-size-xs)',
                          fontStyle: 'italic',
                          color: 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)'
                        }}>
                          "{TONE_PREVIEWS[t.name] || 'Texto de desculpa gerado neste tom.'}"
                        </div>
                      </div>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
                    <Button size="sm" variant="secondary" onClick={() => handleToggleActive(t)}>
                      {t.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(t)}>
                      <EditIcon size={14} style={{ marginRight: '4px' }} /> Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(t.id)}>
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </Card>
              ))}
            </Grid>
          )}
        </CardBody>
      </Card>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTone ? 'Editar Tom de Desculpa' : 'Novo Tom de Desculpa'}
        footer={
          <Stack direction="horizontal" gap={3} justify="end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={createMutation.isPending || updateMutation.isPending}>Salvar</Button>
          </Stack>
        }
      >
        <Stack gap={4}>
          <Input label="Nome do Tom" placeholder="Ex: Sarcástico" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Descrição do Comportamento" placeholder="Ex: Linguagem brincalhona, piadas..." value={description} onChange={(e: any) => setDescription(e.target.value)} />
          <Checkbox label="Tom Ativo na Página Inicial" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </Stack>
      </Modal>
    </Container>
  );
};
export default TonesPage;

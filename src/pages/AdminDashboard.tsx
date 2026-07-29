import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { excuseTonesService } from '../services/excuseTonesService';
import type { ExcuseTone } from '../types/domain.types';
import { useToast } from '../components/ui/Toast/ToastContext';

// Custom UI Components
import {
  Container,
  Flex,
  Stack,
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Badge,
  Modal,
  Checkbox,
  Divider,
  LoadingState,
  EmptyState,
  Dialog
} from '../components/ui';

// Custom Icons
import {
  EditIcon,
  TrashIcon,
  RefreshIcon
} from '../components/icons';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [tones, setTones] = useState<ExcuseTone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State for Create/Edit
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTone, setEditingTone] = useState<ExcuseTone | null>(null);
  const [nameInput, setNameInput] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [toneToDelete, setToneToDelete] = useState<ExcuseTone | null>(null);

  const loadTones = async () => {
    setLoading(true);
    try {
      const res = await excuseTonesService.listAllTones();
      if (res.status === 'success' && res.data) {
        setTones(res.data);
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao carregar tons.', 'error');
      }
    } catch (err: any) {
      addToast(`Erro: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTones();
  }, []);

  const openCreateModal = () => {
    setEditingTone(null);
    setNameInput('');
    setDescriptionInput('');
    setIsActiveInput(true);
    setModalOpen(true);
  };

  const openEditModal = (tone: ExcuseTone) => {
    setEditingTone(tone);
    setNameInput(tone.name);
    setDescriptionInput(tone.description || '');
    setIsActiveInput(tone.is_active);
    setModalOpen(true);
  };

  const handleSaveTone = async () => {
    if (!nameInput.trim()) {
      addToast('O nome do tom é obrigatório.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTone) {
        const res = await excuseTonesService.updateTone(editingTone.id, {
          name: nameInput.trim(),
          description: descriptionInput.trim(),
          is_active: isActiveInput
        });
        if (res.status === 'success') {
          addToast('Tom atualizado com sucesso!', 'success');
          setModalOpen(false);
          loadTones();
        } else {
          addToast(res.error?.friendlyMessage || 'Erro ao atualizar tom.', 'error');
        }
      } else {
        const res = await excuseTonesService.createTone({
          name: nameInput.trim(),
          description: descriptionInput.trim(),
          is_active: isActiveInput
        });
        if (res.status === 'success') {
          addToast('Tom criado com sucesso!', 'success');
          setModalOpen(false);
          loadTones();
        } else {
          addToast(res.error?.friendlyMessage || 'Erro ao criar tom.', 'error');
        }
      }
    } catch (err: any) {
      addToast(`Erro inesperado: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (tone: ExcuseTone) => {
    try {
      const res = await excuseTonesService.updateTone(tone.id, {
        is_active: !tone.is_active
      });
      if (res.status === 'success') {
        addToast(`Tom "${tone.name}" ${!tone.is_active ? 'ativado' : 'desativado'}.`, 'info');
        loadTones();
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao alterar status.', 'error');
      }
    } catch (err: any) {
      addToast(`Erro: ${err.message}`, 'error');
    }
  };

  const confirmDelete = (tone: ExcuseTone) => {
    setToneToDelete(tone);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!toneToDelete) return;
    try {
      const res = await excuseTonesService.deleteTone(toneToDelete.id);
      if (res.status === 'success') {
        addToast('Tom removido com sucesso!', 'success');
        setDeleteDialogOpen(false);
        setToneToDelete(null);
        loadTones();
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao remover tom.', 'error');
      }
    } catch (err: any) {
      addToast(`Erro: ${err.message}`, 'error');
    }
  };

  const handleSeedDefaults = async () => {
    setSubmitting(true);
    try {
      const res = await excuseTonesService.seedDefaultTones();
      if (res.status === 'success') {
        addToast('Tons padrão cadastrados no banco de dados!', 'success');
        loadTones();
      } else {
        addToast(res.error?.friendlyMessage || 'Erro ao cadastrar tons padrão.', 'error');
      }
    } catch (err: any) {
      addToast(`Erro ao povoar banco: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack direction="vertical" gap={8} style={{ paddingBottom: 'var(--spacing-16)' }}>
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Container size="lg">
          <Flex justify="between" align="center" style={{ height: '64px' }}>
            <Stack direction="vertical" gap={1}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', lineHeight: 1.1 }}>
                Painel Administrativo
              </h2>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Gestão de Dados & Tons de Desculpas (excuse_tones)
              </span>
            </Stack>

            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
          </Flex>
        </Container>
      </header>

      {/* TONES SECTION */}
      <Container size="lg">
        <Card>
          <CardHeader>
            <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-4)' }}>
              <div>
                <CardTitle>Tons de Desculpas (Tabela: excuse_tones)</CardTitle>
                <CardDescription>
                  Gerencie os tons que alimentam o seletor da página principal diretamente do banco de dados.
                </CardDescription>
              </div>

              <Flex gap={2}>
                {tones.length === 0 && (
                  <Button variant="secondary" size="sm" onClick={handleSeedDefaults} isLoading={submitting}>
                    <RefreshIcon size={14} style={{ marginRight: '6px' }} /> Cadastrar Tons Padrão
                  </Button>
                )}
                <Button size="sm" onClick={openCreateModal}>
                  + Novo Tom
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody>
            {loading ? (
              <LoadingState message="Carregando tons do banco de dados..." />
            ) : tones.length === 0 ? (
              <EmptyState
                title="Nenhum tom cadastrado no banco de dados"
                description="Cadastre novos tons manualmente ou clique abaixo para popular a tabela excuse_tones com a lista padrão."
                action={
                  <Button onClick={handleSeedDefaults} isLoading={submitting}>
                    Popular Banco com Tons Padrão
                  </Button>
                }
              />
            ) : (
              <Stack gap={3}>
                {tones.map((t) => (
                  <Card key={t.id} style={{ padding: 'var(--spacing-4)' }}>
                    <Flex justify="between" align="center" wrap="wrap" style={{ gap: 'var(--spacing-3)' }}>
                      <Stack gap={1} style={{ flex: 1, minWidth: '200px' }}>
                        <Flex align="center" gap={2}>
                          <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-md)' }}>{t.name}</span>
                          <Badge variant={t.is_active ? 'success' : 'default'}>
                            {t.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </Flex>
                        {t.description && (
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            {t.description}
                          </span>
                        )}
                      </Stack>

                      <Flex align="center" gap={2}>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleToggleActive(t)}
                        >
                          {t.is_active ? 'Desativar' : 'Ativar'}
                        </Button>

                        <Button size="sm" variant="secondary" onClick={() => openEditModal(t)}>
                          <EditIcon size={14} style={{ marginRight: '4px' }} /> Editar
                        </Button>

                        <Button size="sm" variant="danger" onClick={() => confirmDelete(t)}>
                          <TrashIcon size={14} />
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTone ? 'Editar Tom de Desculpa' : 'Novo Tom de Desculpa'}
        footer={
          <Stack direction="horizontal" gap={3} justify="end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTone} isLoading={submitting}>
              Salvar
            </Button>
          </Stack>
        }
      >
        <Stack gap={4}>
          <Input
            label="Nome do Tom (ex: Sincero, Irônico)"
            placeholder="Digite o nome..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <Textarea
            label="Descrição (opcional)"
            placeholder="Breve instrução técnica do tom..."
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />

          <Checkbox
            label="Ativo para exibição na página inicial"
            checked={isActiveInput}
            onChange={(e) => setIsActiveInput(e.target.checked)}
          />
        </Stack>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Remover Tom de Desculpa"
        description={`Tem certeza que deseja remover o tom "${toneToDelete?.name}"? Esta ação removerá o tom do banco de dados.`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </Stack>
  );
};
export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { excuseTonesService } from '../services/excuseTonesService';
import { generationService } from '../services/generationService';
import { useToast } from '../components/ui/Toast/ToastContext';

// Custom UI components
import {
  Container,
  Grid,
  Flex,
  Stack,
  Button,
  Textarea,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  Chip,
  Modal,
  Accordion,
  Avatar,
  Skeleton,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownDivider
} from '../components/ui';

// Custom Icons
import {
  CopyIcon,
  StarIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  CheckIcon,
  RefreshIcon,
  ShareIcon,
  EditIcon
} from '../components/icons';

const faqItems = [
  {
    id: 'faq-1',
    title: 'Como as desculpas são geradas?',
    content: 'Utilizamos a API avançada do Google Gemini para interpretar o contexto e renderizar uma desculpa de alto nível com base no tom que você selecionar.'
  },
  {
    id: 'faq-2',
    title: 'O histórico de desculpas é persistido?',
    content: 'Sim, se você estiver conectado à sua conta, o gerador grava automaticamente todas as desculpas criadas no seu histórico privado.'
  },
  {
    id: 'faq-3',
    title: 'Posso usar o serviço comercialmente?',
    content: 'Sim, as desculpas geradas são livres de direitos autorais e podem ser enviadas em e-mails profissionais, chats corporativos ou mídias sociais.'
  }
];

const examplesItems = [
  {
    id: 'ex-1',
    title: 'Atraso na Reunião',
    tone: 'Corporativo',
    content: 'Peço desculpas pela ausência inicial. Tivemos uma interrupção inesperada nas métricas de rede que exigiu realinhamento prioritário imediato.'
  },
  {
    id: 'ex-2',
    title: 'Esqueci o Aniversário',
    tone: 'Dramático',
    content: 'A escuridão da rotina diária cobriu temporariamente meu calendário. Meu peito dói de arrependimento pelo silêncio de ontem.'
  },
  {
    id: 'ex-3',
    title: 'Faltar a um Jantar',
    tone: 'Irônico',
    content: 'Minhas baterias sociais sofreram um curto-circuito imprevisto. Fui aconselhado pelos médicos a repousar no sofá comendo sorvete.'
  }
];

export const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // State
  const [contextInput, setContextInput] = useState<string>('');
  const [selectedToneId, setSelectedToneId] = useState<string>('');
  const [tones, setTones] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [favorited, setFavorited] = useState<boolean>(false);

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [profileResult, setProfileResult] = useState<string>('');
  const [profileNameInput, setProfileNameInput] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check admin privileges
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    if (user.email === 'thiagomsy@gmail.com') {
      setIsAdmin(true);
    } else {
      authService.hasRole(user.id, 'admin').then(setIsAdmin).catch(() => setIsAdmin(false));
    }
  }, [user]);

  // Load active tones
  useEffect(() => {
    const loadTones = async () => {
      try {
        const res = await excuseTonesService.listActiveTones();
        if (res.status === 'success' && res.data && res.data.length > 0) {
          setTones(res.data);
          setSelectedToneId(res.data[0].id);
        } else {
          const defaultTones = [
            { id: '1', name: 'Sincero' },
            { id: '2', name: 'Irônico' },
            { id: '3', name: 'Corporativo' },
            { id: '4', name: 'Dramático' }
          ];
          setTones(defaultTones);
          setSelectedToneId(defaultTones[0].id);
        }
      } catch {
        const defaultTones = [
          { id: '1', name: 'Sincero' },
          { id: '2', name: 'Irônico' },
          { id: '3', name: 'Corporativo' },
          { id: '4', name: 'Dramático' }
        ];
        setTones(defaultTones);
        setSelectedToneId(defaultTones[0].id);
      }
    };
    loadTones();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      addToast('Sessão encerrada com sucesso.', 'info');
    } catch (err: any) {
      addToast(`Erro ao deslogar: ${err.message}`, 'error');
    }
  };

  const handleGenerate = async () => {
    if (!contextInput.trim()) {
      addToast('Por favor, descreva o contexto da desculpa.', 'warning');
      return;
    }
    setLoading(true);
    setResult('');
    setCopied(false);
    setFavorited(false);

    try {
      const selectedToneObj = tones.find((t) => t.id === selectedToneId);
      const res = await generationService.generateExcuse({
        userId: user?.id,
        contextInput,
        toneId: selectedToneId,
        toneName: selectedToneObj?.name
      });

      if (res.status === 'success' && res.data) {
        setResult(res.data.generated_text);
        addToast('Desculpa gerada com sucesso!', 'success');
      } else {
        const errorMsg = res.error?.friendlyMessage || 'Erro durante a geração.';
        addToast(errorMsg, 'error');
      }
    } catch (err: any) {
      addToast(`Erro inesperado: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    addToast('Copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    addToast(favorited ? 'Removido dos favoritos.' : 'Adicionado aos favoritos!', 'info');
  };

  // Profile methods
  const handleLoadProfile = async () => {
    if (!user) {
      setProfileResult('Erro: Usuário não autenticado.');
      return;
    }
    try {
      const profile = await authService.getProfile(user.id);
      if (profile) {
        setProfileResult(JSON.stringify(profile, null, 2));
        setProfileNameInput(profile.full_name || '');
        addToast('Perfil carregado com sucesso!', 'success');
      } else {
        setProfileResult('Perfil não encontrado na tabela public.profiles.');
      }
    } catch (err: any) {
      setProfileResult(`Erro ao carregar perfil: ${err.message}`);
      addToast('Erro ao obter perfil.', 'error');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      setProfileResult('Erro: Usuário não autenticado.');
      return;
    }
    try {
      const updated = await authService.updateProfile(user.id, {
        full_name: profileNameInput,
        email: user.email || ''
      });
      setProfileResult(`Perfil atualizado com sucesso:\n${JSON.stringify(updated, null, 2)}`);
      addToast('Perfil atualizado!', 'success');
    } catch (err: any) {
      setProfileResult(`Erro ao atualizar perfil: ${err.message}`);
      addToast('Erro ao atualizar perfil.', 'error');
    }
  };

  return (
    <Stack direction="vertical" gap={8} style={{ paddingBottom: 'var(--spacing-16)' }}>
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Container size="lg">
          <Flex justify="between" align="center" style={{ height: '64px' }}>
            <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textDecoration: 'none' }}>
              <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-md)', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
                Sinto Muito<span style={{ color: 'var(--color-accent)' }}>!</span>
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                (Muito Pouco)
              </span>
            </Link>

            <Flex align="center" gap={4}>
              {user ? (
                <Dropdown trigger={<Avatar name={user.email} style={{ cursor: 'pointer' }} className="hover-scale transition-all" />}>
                  <div style={{ padding: 'var(--spacing-2) var(--spacing-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {user.email}
                  </div>
                  <DropdownDivider />
                  <DropdownItem icon={<UserIcon size={16} />} onClick={() => { setProfileModalOpen(true); handleLoadProfile(); }}>
                    Configurar Perfil
                  </DropdownItem>
                  {isAdmin && (
                    <DropdownItem icon={<SettingsIcon size={16} />} onClick={() => navigate('/admin')}>
                      Painel Admin
                    </DropdownItem>
                  )}
                  <DropdownItem icon={<LogOutIcon size={16} />} variant="danger" onClick={handleLogout}>
                    Sair da Conta
                  </DropdownItem>
                </Dropdown>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* HERO SECTION */}
      <Container size="md" style={{ textAlign: 'center', marginTop: 'var(--spacing-6)' }}>
        <Stack gap={4} align="center">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 'bold', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Sua criatividade acabou?<br />
            <span style={{ background: 'linear-gradient(90deg, #ffffff, var(--color-text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              A culpa termina aqui.
            </span>
          </h1>
          <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-muted)', maxWidth: '520px', lineHeight: 1.6 }}>
            Gere desculpas perfeitas e altamente duvidosas para qualquer situação desconfortável.
          </p>
        </Stack>
      </Container>

      {/* MAIN CONTEXT FORM */}
      <Container size="sm">
        <Card glow style={{ padding: 'var(--spacing-6)' }}>
          <Stack gap={5}>
            <Textarea
              label="Descreva o contexto da enrascada:"
              placeholder="Ex: Esqueci o aniversário de namoro / Me atrasei para a reunião diária com o cliente..."
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              disabled={loading}
            />

            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>
                Selecione o tom da desculpa:
              </label>
              <Flex gap={2} wrap="wrap">
                {tones.map((t) => (
                  <Chip
                    key={t.id}
                    active={selectedToneId === t.id}
                    onClick={() => setSelectedToneId(t.id)}
                    disabled={loading}
                  >
                    {t.name}
                  </Chip>
                ))}
              </Flex>
            </div>

            <Button onClick={handleGenerate} isLoading={loading}>
              Gerar Desculpa
            </Button>
          </Stack>
        </Card>
      </Container>

      {/* RESULT CONTAINER */}
      {(loading || result) && (
        <Container size="sm">
          <Card style={{ borderColor: 'var(--color-accent-hover)', boxShadow: 'var(--shadow-glow)' }}>
            <CardHeader>
              <CardTitle>Desculpa Gerada</CardTitle>
              <CardDescription>Pronta para salvar as aparências</CardDescription>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Stack gap={2}>
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="90%" height={16} />
                  <Skeleton width="75%" height={16} />
                </Stack>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result}</p>
              )}
            </CardBody>
            {!loading && result && (
              <CardFooter style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                <Button size="sm" variant="secondary" onClick={handleCopy}>
                  {copied ? <CheckIcon size={16} style={{ marginRight: '6px' }} /> : <CopyIcon size={16} style={{ marginRight: '6px' }} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
                <Button size="sm" variant="secondary" onClick={handleFavorite}>
                  <StarIcon size={16} filled={favorited} style={{ marginRight: '6px', color: favorited ? 'var(--color-warning)' : undefined }} />
                  {favorited ? 'Favoritado' : 'Favoritar'}
                </Button>

                {/* Visual states placeholders for future implementations */}
                <Button size="sm" variant="ghost" disabled style={{ opacity: 0.4 }}>
                  <RefreshIcon size={14} style={{ marginRight: '4px' }} /> Regenerar
                </Button>
                <Button size="sm" variant="ghost" disabled style={{ opacity: 0.4 }}>
                  <EditIcon size={14} style={{ marginRight: '4px' }} /> Editar
                </Button>
                <Button size="sm" variant="ghost" disabled style={{ opacity: 0.4 }}>
                  <ShareIcon size={14} style={{ marginRight: '4px' }} /> Compartilhar
                </Button>
              </CardFooter>
            )}
          </Card>
        </Container>
      )}

      {/* HOW IT WORKS */}
      <Container size="lg" style={{ marginTop: 'var(--spacing-10)' }}>
        <Stack gap={6} align="center">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Como Funciona</h2>
          <Grid cols={1} mdCols={3} gap={6} style={{ width: '100%' }}>
            <Card>
              <CardTitle>1. Explique a situação</CardTitle>
              <CardBody>Conte em poucas palavras o que deu errado ou qual convite você quer recusar.</CardBody>
            </Card>
            <Card>
              <CardTitle>2. Escolha o tom</CardTitle>
              <CardBody>Selecione a abordagem que melhor se encaixa: irônica, sincera, corporativa ou dramática.</CardBody>
            </Card>
            <Card>
              <CardTitle>3. Copie e envie</CardTitle>
              <CardBody>A IA do Gemini cria o texto na hora. Você copia, envia e continua livre de culpas.</CardBody>
            </Card>
          </Grid>
        </Stack>
      </Container>

      {/* EXAMPLES SECTION */}
      <Container size="lg">
        <Stack gap={6} align="center">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Exemplos de Sucesso</h2>
          <Grid cols={1} mdCols={3} gap={6} style={{ width: '100%' }}>
            {examplesItems.map((ex) => (
              <Card key={ex.id} interactive>
                <CardHeader>
                  <CardTitle>{ex.title}</CardTitle>
                  <CardDescription>Tom: {ex.tone}</CardDescription>
                </CardHeader>
                <CardBody style={{ color: 'var(--color-text-muted)' }}>"{ex.content}"</CardBody>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* FAQ SECTION */}
      <Container size="md">
        <Stack gap={6} align="center">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Perguntas Frequentes</h2>
          <Accordion items={faqItems} />
        </Stack>
      </Container>

      {/* FOOTER */}
      <footer style={{ marginTop: 'var(--spacing-10)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-6)' }}>
        <Container size="lg">
          <Flex justify="between" align="center" direction="column" style={{ gap: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} Sinto Muito (Muito Pouco). Todos os direitos reservados.
            </span>
            <Flex gap={4}>
              <Link to="/health" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }} className="hover-scale transition-all">
                Diagnóstico de Infraestrutura
              </Link>
            </Flex>
          </Flex>
        </Container>
      </footer>

      {/* PROFILE VALIDATION MODAL */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Configurações do Perfil"
        footer={
          <Stack direction="horizontal" gap={3} justify="end">
            <Button variant="secondary" onClick={() => setProfileModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleUpdateProfile}>
              Salvar Nome
            </Button>
          </Stack>
        }
      >
        <Stack gap={4}>
          <div style={{ fontSize: 'var(--font-size-sm)' }}>
            Email cadastrado: <strong style={{ color: 'var(--color-text)' }}>{user?.email}</strong>
          </div>

          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={profileNameInput}
            onChange={(e) => setProfileNameInput(e.target.value)}
          />

          {isAdmin && (
            <>
              <Stack direction="horizontal" gap={2}>
                <Button size="sm" variant="secondary" onClick={handleLoadProfile}>
                  Recarregar Perfil do Banco
                </Button>
              </Stack>

              <Divider />

              <div>
                <div className="input-label" style={{ marginBottom: 'var(--spacing-2)' }}>Retorno da tabela profiles:</div>
                <pre style={{ 
                  background: 'var(--color-background)', 
                  border: '1px solid var(--color-border)', 
                  padding: 'var(--spacing-3)', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: 'var(--font-size-xs)', 
                  maxHeight: '150px', 
                  overflowY: 'auto',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'monospace'
                }}>
                  {profileResult || 'Nenhuma consulta realizada.'}
                </pre>
              </div>
            </>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
};
export default Home;

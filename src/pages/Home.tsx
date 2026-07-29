import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const Home: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileResult, setProfileResult] = useState<string>('');
  const [profileNameInput, setProfileNameInput] = useState<string>('');

  const handleLogout = async () => {
    try {
      await signOut();
      setProfileResult('Sessão encerrada.');
    } catch (err: any) {
      setProfileResult(`Erro ao deslogar: ${err.message}`);
    }
  };

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
      } else {
        setProfileResult('Perfil não encontrado na tabela public.profiles.');
      }
    } catch (err: any) {
      setProfileResult(`Erro ao carregar perfil: ${err.message}`);
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
    } catch (err: any) {
      setProfileResult(`Erro ao atualizar perfil: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Sinto Muito (Muito Pouco) - Home</h1>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <h3>Status de Autenticação</h3>
        {user ? (
          <div>
            <p>Conectado como: <strong>{user.email}</strong></p>
            <p>ID: <code>{user.id}</code></p>
            <button onClick={handleLogout} style={{ marginRight: '10px' }}>Sair</button>
            <Link to="/admin"><button>Ir para Painel Admin</button></Link>
          </div>
        ) : (
          <div>
            <p>Status: Não autenticado</p>
            <button onClick={() => navigate('/login')}>Fazer Login / Cadastrar</button>
          </div>
        )}
      </div>

      {user && (
        <div style={{ background: '#eef9ff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <h3>Ações de Validação do Perfil</h3>
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleLoadProfile} style={{ marginRight: '10px' }}>Carregar Perfil</button>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={profileNameInput} 
              onChange={(e) => setProfileNameInput(e.target.value)} 
              style={{ padding: '4px', marginRight: '10px', width: '200px' }}
            />
            <button onClick={handleUpdateProfile}>Salvar/Atualizar Perfil</button>
          </div>
          <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', overflowX: 'auto', maxHeight: '200px', border: '1px solid #ccc' }}>
            {profileResult || 'Aguardando ação...'}
          </pre>
        </div>
      )}
    </div>
  );
};

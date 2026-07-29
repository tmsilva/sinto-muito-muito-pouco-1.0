import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await authService.signIn(email, password);
      setMessage('Logado com sucesso!');
      navigate('/');
    } catch (err: any) {
      setMessage(`Erro ao fazer login: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await authService.signUp(email, password);
      setMessage('Usuário cadastrado! Verifique seu e-mail para confirmação se necessário.');
    } catch (err: any) {
      setMessage(`Erro ao cadastrar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Acesso / Autenticação</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>E-mail:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required 
          />
        </div>
        
        {message && (
          <div style={{ padding: '10px', background: '#ffebeb', border: '1px solid #ffc2c2', borderRadius: '4px', fontSize: '14px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px' }}>
            {loading ? 'Processando...' : 'Entrar'}
          </button>
          <button type="button" onClick={handleSignUp} disabled={loading} style={{ flex: 1, padding: '10px' }}>
            Cadastrar
          </button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}>
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

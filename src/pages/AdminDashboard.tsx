import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#d9534f' }}>Painel Administrativo</h1>
      <div style={{ background: '#fdf7f7', border: '1px solid #ebccd1', padding: '1rem', borderRadius: '4px' }}>
        <p>Esta área é restrita.</p>
        <p><strong>Apenas usuários autenticados com o papel (role) de "admin" podem acessar este painel.</strong></p>
        <p>A validação do RBAC (Role-Based Access Control) foi executada com sucesso!</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '10px 15px' }}>
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

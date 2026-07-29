# Guia de Configuração e Setup - Sinto Muito (Muito Pouco)

Este documento orienta o desenvolvedor e o administrador a preparar a infraestrutura local e em nuvem do projeto.

---

## 🛠️ Passo a Passo de Instalação

### 1. Clonar e Instalar Dependências
No terminal da raiz do projeto, instale os pacotes npm:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Na raiz, crie um arquivo `.env` ou `.env.local` usando as variáveis do exemplo:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Aplicar Migrations no Supabase

Você pode aplicar a estrutura do banco de duas maneiras:

#### Opção A: Usando a CLI do Supabase (Recomendado)
Se você estiver utilizando a CLI do Supabase localmente:
1. Certifique-se de que o Docker está rodando e inicie o Supabase:
   ```bash
   supabase start
   ```
2. Aplique a migration:
   ```bash
   supabase db reset
   ```

#### Opção B: Manualmente pelo Painel do Supabase
1. Acesse o console do [Supabase](https://supabase.com/).
2. Abra o menu **SQL Editor** no projeto desejado.
3. Crie uma nova query e copie todo o conteúdo do arquivo:
   `supabase/migrations/20260729000000_init.sql`.
4. Clique em **Run** para criar a infraestrutura das tabelas (`profiles`, `roles`, `user_roles`), habilitar as RLS e registrar a função `is_admin()`.

### 4. Cadastrar Papéis (Roles) Manualmente
Como as tabelas são criadas limpas sem seed de testes, você precisa cadastrar os papéis necessários:
1. Vá até o editor SQL ou visualizador de tabela no Supabase.
2. Insira os papéis padrão:
   ```sql
   INSERT INTO public.roles (name) VALUES ('admin'), ('user');
   ```

### 5. Atribuir Role a um Usuário
Para testar a rota `/admin` no frontend, associe seu usuário à role correspondente:
1. Obtenha o UUID do seu usuário na aba de Authentication do Supabase (ou após se cadastrar no formulário `/login`).
2. Vincule o ID do usuário ao ID da role 'admin' inserindo um registro em `public.user_roles`:
   ```sql
   INSERT INTO public.user_roles (user_id, role_id) 
   VALUES ('UUID_DO_SEU_USUARIO', (SELECT id FROM public.roles WHERE name = 'admin'));
   ```

---

## 📋 Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento local.
- `npm run build`: Compila a aplicação para produção.
- `npm run test`: Executa os testes de unidade mockados com Vitest.
- `npm run validate-env`: Roda o script de integridade de dependências e variáveis de ambiente.

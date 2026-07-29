# Protocolo de Validação e Testes - Sinto Muito (Muito Pouco)

Este documento descreve como validar a infraestrutura técnica e de segurança da aplicação.

---

## 🧪 1. Testes Automatizados (Mocks)

Os testes automatizados utilizam mocks para evitar chamadas de rede e dependências de dados reais do Supabase, permitindo execução ágil em CI/CD ou localmente.

### Como Rodar:
```bash
npm run test
```

### O que é testado:
- **Autenticação:**
  - Login bem-sucedido via `signIn` mockado.
  - Registro de conta bem-sucedido via `signUp` mockado.
  - Processo de logout via `signOut`.
- **Perfis (Profiles):**
  - Carregamento correto de dados de perfil do usuário.
  - Atualização dos dados do perfil.
- **RBAC (Roles):**
  - Recuperação dos papéis de usuário no banco.
  - Verificação se o usuário possui ou não permissões administrativas (`hasRole`).

---

## 🔍 2. Validação Manual Real (Supabase)

Para certificar-se de que a conexão e segurança do Supabase estão configuradas perfeitamente, siga o roteiro abaixo.

### Passo 1: Validação de Conectividade
Execute o script utilitário para checar a conectividade de rede com a API Rest do Supabase:
```bash
npm run validate-env
```
*Resultado esperado: "Validação concluída: AMBIENTE OK!"*

### Passo 2: Criação de Usuário e Autenticação
1. Inicie a aplicação: `npm run dev`.
2. Acesse `http://localhost:5173/login`.
3. Preencha e-mail/senha e clique em **Cadastrar**.
4. Verifique no painel do Supabase (**Authentication -> Users**) se o usuário foi cadastrado.
5. Faça login com a conta recém-criada.

### Passo 3: Persistência de Sessão
1. Após logar, recarregue a página (F5).
2. *Resultado esperado: O cabeçalho na Home deve manter a mensagem "Conectado como: [seu-email]" e exibir o UUID correspondente.*

### Passo 4: Escrita e Leitura de Perfil
1. Na Home, clique no botão **Carregar Perfil**.
   *Resultado esperado: Uma mensagem informará que o perfil ainda não existe no banco (já que removemos o trigger automático de criação).*
2. Preencha o campo de texto com seu nome completo e clique em **Salvar/Atualizar Perfil**.
3. O painel exibirá o objeto retornado de `profiles`.
4. Verifique na tabela `public.profiles` do Supabase se o registro foi inserido com seu `id` de usuário.
5. Clique novamente em **Carregar Perfil**.
   *Resultado esperado: O seu nome completo configurado deve aparecer na tela.*

### Passo 5: Teste de RBAC (Controle de Acesso)
1. Tente acessar a rota `/admin` digitando diretamente na barra de endereço do navegador.
   *Resultado esperado: Você será redirecionado para a Home (`/`), pois seu usuário padrão não possui o papel administrativo.*
2. No painel do Supabase, associe seu usuário ao papel `admin` na tabela `user_roles` (veja instruções no arquivo `SETUP.md`).
3. Retorne ao aplicativo e clique em **Ir para Painel Admin** ou acesse `/admin`.
   *Resultado esperado: O painel administrativo vermelho "Painel Administrativo" será renderizado sem redirecionamentos.*

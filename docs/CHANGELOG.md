# Changelog - Sinto Muito (Muito Pouco)

Toda alteração relevante a este projeto será registrada neste arquivo.

---

## [1.0.0] - 2026-07-28

### Adicionado
- **Setup Inicial Frontend:** Criação do scaffolding do projeto utilizando React 19, TypeScript e Vite.
- **Integração com Supabase:** Adicionada a biblioteca `@supabase/supabase-js` e criado o client tipado em `src/services/supabaseClient.ts`.
- **Banco de Dados (Migrations):** Criação de `supabase/migrations/20260729000000_init.sql` contendo tabelas `profiles`, `roles`, `user_roles` e políticas RLS detalhadas com a função customizada `is_admin()`.
- **Ciclo de Autenticação Contextualizado:** Implementação do `AuthContext` e do hook `useAuth` para controle isolado do estado do usuário e sessão do Supabase.
- **Roteamento Privado & RBAC:** Criação de componentes guards `ProtectedRoute` e `AdminRoute` no frontend e gerenciamento em `src/routes/AppRoutes.tsx`.
- **Páginas de Integração e Teste:** Páginas funcionais básicas `/`, `/login`, `/admin` para depuração das chamadas e validação da infraestrutura.
- **Testes Automatizados de Serviço:** Suíte de testes unitários com mocks em `src/services/__tests__/authService.test.ts` utilizando Vitest e JSDOM.
- **Script de Validação:** Script utilitário em `scripts/validate-env.js` para certificar dependências, variáveis locais e conectividade com a API rest do Supabase.
- **Documentação Técnica Base:** Elaborados os documentos `PROJECT_BLUEPRINT.md`, `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md`, `README.md`, `SETUP.md` e `VALIDATION.md`.

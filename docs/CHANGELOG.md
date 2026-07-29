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

### Modificado / Corrigido (Ajustes de Infraestrutura e Diagnóstico)
- **Erros de Compilação TypeScript:** Resolvidos erros de `verbatimModuleSyntax` e importações de tipo (type-only imports) no `supabaseClient.ts` e `AuthContext.tsx`.
- **Configuração do Vitest:** Corrigido o `defineConfig` no `vite.config.ts` importando-o de `vitest/config` para reconhecer nativamente a propriedade `test`.
- **Painel de Diagnóstico (/health):** Implementada a rota `/health` exibindo chaves de integridade, Health Score (percentual dinâmico), metadados de build/testes e status dos módulos principais.
- **Resolução de Módulos JSON:** Adicionada a opção `resolveJsonModule` em `tsconfig.app.json` para suportar importação direta do `package.json` na rota de saúde.

---

## [1.1.0] - 2026-07-29

### Adicionado
- **Modelagem de Banco de Dados:** Criadas migrations `20260729000001_ai_models.sql` a `20260729000007_audit_logs.sql` mapeando o domínio de dados.
- **Convenções e Índices:** Padronizados PKs em UUID, timestamps com timezone (`timestamptz`), nomenclatura em `snake_case`, além de chaves estrangeiras, constraints exclusivas e índices específicos para performance e suporte a soft delete.
- **Camada de Repositório (`src/repositories/`):** Estruturação do acesso ao banco através de repositórios independentes (`aiModelsRepository`, `aiSettingsRepository`, `excuseTonesRepository`, `promptTemplatesRepository`, `applicationSettingsRepository`, `excusesRepository`, `auditLogsRepository`).
- **Camada de Serviços (`src/services/`):** Serviços desacoplados contendo as chamadas que consomem as instâncias da camada de repositório.
- **Segurança (RLS):** Criação e documentação detalhada de todas as políticas de controle de acesso no nível de linha (RLS) nas novas tabelas.

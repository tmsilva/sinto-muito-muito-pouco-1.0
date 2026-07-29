# Sinto Muito (Muito Pouco)

O **Sinto Muito (Muito Pouco)** é uma plataforma interativa para geração de desculpas estilizadas, contando com gerenciamento de perfis, controle de acesso baseado em papéis (RBAC) e auditoria de conteúdo.

---

## 🚀 Como Começar

### Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Configuração do Ambiente
1. Copie o arquivo `.env.example` para `.env.local` ou `.env`:
   ```bash
   cp .env.example .env.local
   ```
2. Insira suas credenciais do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Valide a configuração do ambiente:
   ```bash
   npm run validate-env
   ```

5. Rode a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Acesse a rota de diagnósticos técnicos `/health` para visualizar o status de integridade do ambiente.

---

## 📁 Estrutura de Documentos

Para informações mais aprofundadas sobre o projeto, consulte:

- **[Instalação e Setup](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/SETUP.md):** Guia detalhado para subir o projeto localmente e aplicar as migrations do Supabase.
- **[Validação e Testes](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/VALIDATION.md):** Manual descrevendo os testes automatizados e roteiro de validação manual no Supabase.
- **[Especificação Arquitetural](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/docs/ARCHITECTURE.md):** Detalhes sobre a arquitetura, separação de responsabilidades e diagrama de fluxo.
- **[Planejamento Técnico (Roadmap)](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/docs/IMPLEMENTATION_PLAN.md):** Próximas etapas de implementação do sistema.
- **[Blueprint de Projeto](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/docs/PROJECT_BLUEPRINT.md):** Visão conceitual e escopo do produto.
- **[Changelog](file:///e:/Projetos/sinto-muito-muito-pouco%201.0/docs/CHANGELOG.md):** Histórico detalhado de alterações do projeto.

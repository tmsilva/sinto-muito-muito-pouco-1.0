# Project Blueprint - Sinto Muito (Muito Pouco)

Este documento define o plano conceitual e a especificação de produto do **Sinto Muito (Muito Pouco)**, um gerador automatizado e catálogo de desculpas estilizadas com controle de acesso, auditoria e histórico de interações.

---

## 1. Visão Geral do Produto
O **Sinto Muito (Muito Pouco)** é uma plataforma voltada para a criação, curadoria e compartilhamento de desculpas (sinceras ou irônicas) para situações cotidianas. Ele fornece uma interface para usuários gerarem e customizarem desculpas baseando-se em contextos variados, enquanto provê aos administradores ferramentas para gerenciar o acervo.

---

## 2. Escopo da Versão 1.0 (Fundação Técnica)
Nesta etapa inicial de infraestrutura, os seguintes módulos técnicos foram estabelecidos como fundação do sistema:

- **Infraestrutura Supabase:** Tabelas relacionais básicas de perfis de usuário (`profiles`), tabelas de papéis (`roles`) e relacionamento de permissões (`user_roles`).
- **Segurança de Banco de Dados (RLS):** Relações de segurança no nível de linha (Row Level Security) protegendo os registros de perfil e acesso administrativo de forma estrita.
- **Ciclo de Autenticação Limpo:** Criação do `AuthContext` apartando o controle de ciclo de sessão de autenticação do Supabase do gerenciamento de perfis e RBAC.
- **Roteamento Protegido:** Guarda de rotas no frontend (`ProtectedRoute` e `AdminRoute`) para validar sessões ativas e papéis administrativos dinamicamente.
- **Validação de Ambiente:** Script automatizado (`scripts/validate-env.js`) para assegurar as configurações corretas de ambiente de desenvolvimento.

---

## 3. Roadmaps e Funcionalidades Futuras
Os módulos que serão implementados a seguir incluem:

- **Gerenciador de Desculpas:** Mecanismos de inserção de novas desculpas com tags de contexto e níveis de formalidade.
- **Histórico e Favoritos:** Tabela de salvamento de desculpas geradas pelos usuários.
- **Interface Visual Premium:** Design com tema escuro elegante, micro-animações e componentes estilizados sob medida com Vanilla CSS.

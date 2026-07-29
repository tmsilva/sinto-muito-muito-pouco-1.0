# Technical Implementation Plan - Próximas Etapas

Este plano detalha o roteiro de engenharia técnica para as etapas subsequentes do projeto **Sinto Muito (Muito Pouco)** pós-validação de infraestrutura básica.

---

## Roadmap Técnico

### Etapa 1: Validação da Infraestrutura (Concluída)
- **Objetivos:** Estabelecer a fundação React/TS/Vite, cliente do Supabase, migrations RLS, ciclo isolado do `AuthContext`, roteamento RBAC, testes de unidade e o painel diagnóstico `/health`.

### Etapa 2: Modelagem Completa do Domínio (Concluída)
- **Objetivos:** Estruturar todas as entidades de banco com convenções rígidas, chaves estrangeiras, índices e suporte a soft delete: `ai_models`, `ai_settings`, `excuse_tones`, `prompt_templates`, `application_settings`, `excuses` e `audit_logs`.
- **Camada de Dados:** Criação de repositórios e serviços desacoplados para o acesso a essas entidades. RLS configurado e documentado.

### Etapa 3: Design System e Estética Visual Premium
- **Objetivos:** Definir o visual premium da aplicação sem Tailwind, usando Vanilla CSS puro.
- **Implementações:**
  - Configuração do `src/index.css` contendo variáveis CSS globais (paleta HSL harmônica de tons escuros, gradientes sofisticados e variáveis de espaçamento).
  - Integração da fonte Google Fonts (ex. *Outfit* ou *Plus Jakarta Sans*).
  - Desenvolvimento de micro-animações, efeitos hover interativos e elementos estilo glassmorphism.

### Etapa 4: Gerador e Motor de Desculpas
- **Objetivos:** Criar a experiência de seleção e geração.
- **Componentes:**
  - Seletor de tom (Formal, Irônico, Dramático, Minimalista).
  - Seletor de categoria (Trabalho, Relacionamento, Atraso, Outros).
  - Fluxo de carregamento interativo com animações.

### Etapa 5: Histórico ("Minhas Desculpas")
- **Objetivos:** Gerenciar o histórico do usuário logado.
- **Recursos:**
  - Grid de cards estilizados com ações de: Copiar para área de transferência, favoritar, compartilhar e remover do histórico.

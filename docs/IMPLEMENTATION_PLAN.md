# Technical Implementation Plan - Próximas Etapas

Este plano detalha o roteiro de engenharia técnica para as etapas subsequentes do projeto **Sinto Muito (Muito Pouco)** pós-validação de infraestrutura básica.

---

## Roadmap Técnico

### Etapa 2: Banco de Dados de Conteúdo e RLS Avançado
- **Objetivos:** Estruturar as tabelas que suportarão o fluxo principal do gerador.
- **Tabelas a criar:**
  - `public.apologies`: Tabela de desculpas padrão inseridas por administradores.
  - `public.generated_excuses`: Histórico de desculpas salvas ou criadas por usuários (com colunas `title`, `message`, `favorite`, `created_by`).
- **Configurações de RLS:**
  - Apenas administradores cadastrados podem inserir/atualizar/deletar na tabela `apologies`.
  - Usuários autenticados podem interagir apenas com seus próprios registros em `generated_excuses`.

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

# Design System - Sinto Muito (Muito Pouco) (v2.0)

Este documento descreve as diretrizes, tokens e a biblioteca de componentes reutilizáveis construída para a plataforma **Sinto Muito (Muito Pouco)**.

---

## 🎨 Design Tokens

### Cores (Tema Dark Premium)
Todas as cores são declaradas em `src/styles/tokens.css` sob o escopo `:root`.
- **Fundo principal (`--color-background`):** `#09090b` (Preto profundo/Zinc-950)
- **Superfície (`--color-surface`):** `#0e0e11` (Preto azulado de contraste intermediário)
- **Cartão (`--color-card`):** `#18181b` (Cinza escuro/Zinc-900)
- **Borda (`--color-border`):** `#27272a` (Cinza médio/Zinc-800)
- **Texto principal (`--color-text`):** `#fafafa` (Branco fosco/Zinc-50)
- **Texto mutado (`--color-text-muted`):** `#a1a1aa` (Cinza claro/Zinc-400)
- **Destaque (`--color-accent`):** `#6366f1` (Índigo/Violeta dinâmico)

### Escala de Espaçamento
Baseada em múltiplos de 4px:
- `--spacing-1`: `4px`
- `--spacing-2`: `8px`
- `--spacing-3`: `12px`
- `--spacing-4`: `16px`
- `--spacing-5`: `20px`
- `--spacing-6`: `24px`
- `--spacing-8`: `32px`
- `--spacing-10`: `40px`
- `--spacing-12`: `48px`
- `--spacing-16`: `64px`

### Sombras e Camadas
- **Níveis:** `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-glow` (brilho violeta de destaque).
- **Z-Index:** `--z-index-base` (0), `--z-index-dropdown` (10), `--z-index-sticky` (20), `--z-index-tooltip` (30), `--z-index-modal-backdrop` (40), `--z-index-modal` (50), `--z-index-toast` (100).

---

## ✨ Animações & Micro-interações
- **Shimmer Effect:** Animação de gradiente linear em skeletons para estados de carregamento suave.
- **Micro-interações de Clique:** `.press-scale` reduz o elemento em `scale(0.98)` no evento `:active`.
- **Hovers Fluidos:** Transição com curva cúbica lenta (`var(--transition-normal)`) nas bordas e elevações.

---

## 🧩 Componentes Disponíveis

### 1. Layouts Estruturais (`src/components/ui/Layout/`)
- **`Container`:** Controla a largura máxima da página (`sm`, `md`, `lg`, `xl`).
- **`Grid`:** Facilita a criação de grids dinâmicos e responsivos (`cols`, `gap`, `smCols`, `mdCols`, `lgCols`).
- **`Flex`:** Alinhamento flexbox abstrato (`direction`, `justify`, `align`, `wrap`, `gap`).
- **`Stack`:** Organização linear simples (`direction="vertical | horizontal"`, `gap`, `align`).

### 2. Controles de Formulário
- **`Button`:** Variantes `primary`, `secondary`, `danger` e `ghost`. Suporta indicador `isLoading` (spinner integrado) e desabilitação.
- **`Input`:** Campo de entrada com suporte a rótulos e exibição de mensagens de erro.
- **`Textarea`:** Campo multiline adaptado para descrição de contexto.
- **`Select`:** Caixa de seleção nativa com setas customizadas via CSS.
- **`Checkbox` & `Radio`:** Seletores estilizados com foco visível.

### 3. Feedback Visuais
- **`Badge`:** Etiquetas de estados (`default`, `success`, `warning`, `danger`, `accent`).
- **`Chip`:** Botões estilo pílula ideais para seleção rápida de filtros (ex: tom da desculpa).
- **`Alert`:** Banner contendo o ícone de aviso de sistema.
- **`Toast`:** Notificações flutuantes. Gerenciadas dinamicamente através do `ToastProvider` e do hook `useToast()`.
- **`Spinner` & `Skeleton`:** Indicadores e placeholders animados com Shimmer.

### 4. Componentes de Tela
- **`Card`:** Blocos com efeitos `glow` e hovers `interactive`.
- **`Modal` & `Dialog`:** Modais de tela cheia com bloqueio de scroll de fundo e fechamento via tecla `Escape`.
- **`Accordion`:** Abas colapsáveis excelentes para menus de FAQ.
- **`Tooltip`:** Dicas rápidas flutuantes exibidas ao passar o mouse.
- **`Avatar`:** Avatar circular com fallback automático de iniciais.
- **`Dropdown`:** Menu inteligente que flutua como popover no Desktop e desliza como Drawer na base da tela em celulares.

---

## ♿ Acessibilidade
1. **Foco Visível:** Todos os controles interativos utilizam contornos de alto contraste ao receber foco via teclado (`*:focus-visible`).
2. **Navegação:** Teclas padrão de navegação (tab, setas, enter) são respeitadas.
3. **Mapeamento ARIA:** Modais e caixas de seleção possuem atributos `role="dialog"`, `aria-modal="true"`, `aria-expanded` e `aria-invalid` mapeados de acordo com os estados dinâmicos.

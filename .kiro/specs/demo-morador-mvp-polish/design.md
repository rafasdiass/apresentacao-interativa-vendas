# Documento de Design — Polimento da Demo do Morador (visual de MVP)

## Overview

Esta feature reformula a aba **Morador** da seção `Demo` (`src/features/demo/DemoMorador.tsx` e seus componentes filhos em `src/features/demo/components/`) para que pareça um aplicativo mobile em versão final, eliminando dois sintomas que quebram a ilusão durante a apresentação ao vivo:

1. **Reflow dimensional** — o `MobileMockup` hoje cresce e encolhe conforme a Área escolhida, a presença/ausência da `ConfirmMessage` e o rótulo do `ConfirmButton`.
2. **Visual básico demais** — faltam elementos estruturais de home screen (tab bar inferior, banner de destaque, status bar realista, header com avatar), identidade visual nos cards de área, hierarquia forte nos estados dos slots e micro-interações.

A estratégia é **UI-only, comportamento intocado**: `demoReducer`, `useDemoReservas`, `derived.ts` e `types.ts` permanecem byte-idênticos. Todo o polimento acontece em cinco subcomponentes visuais do mockup (três novos, dois reformados) e em um refactor do container da `Demo_Morador` para produzir um layout de altura e largura fixas em pixels, com slots CSS rígidos que reservam espaço antes do conteúdo aparecer.

O objetivo funcional da Demo continua sendo: permitir ao `Apresentador` demonstrar em 3 toques o fluxo de reserva (selecionar área → selecionar slot → confirmar), mantendo validadas as Properties 3–8 do spec pai `apresentacao-interativa-vendas`.

### Decisões-chave e justificativas

| Decisão | Alternativa descartada | Justificativa |
| --- | --- | --- |
| `MobileMockup` com grid CSS de **7 linhas de altura fixa em pixels** (`grid-template-rows`) | Flex column com `min-h` em cada bloco | Grid com `grid-template-rows: repeat(7, <px>)` garante que a soma das alturas é a altura do container, independentemente do conteúdo. Flex com `min-h` permite o conteúdo empurrar o container para além do esperado. |
| Altura total do mockup = **640px** (largura = 320px, razão 1:2, silhueta iPhone-like) | 360×740, 375×812 | 640px cabe confortavelmente em 768px de viewport vertical (onde a `Demo_Morador` aparece) e deixa margem para `max-h` do SlotGrid da Quadra (14 slots × 3 colunas = 5 linhas). 320px mantém compatibilidade com `max-w-[320px]` atualmente usado no `MobileMockup`. |
| `SlotGrid` com **área de altura fixa** (`h-[208px]`) e conteúdo interno variável | `min-h` calculado por área | Quadra (5 linhas) define a altura máxima. Deck (3 linhas) e Piscina (bloco informativo) ficam centralizados verticalmente no mesmo `h-[208px]`, eliminando o reflow do Requisito 1.7. |
| `ConfirmMessage` com **wrapper sempre presente** (`h-[56px]`) e conteúdo condicional | Montagem condicional do componente | O wrapper reserva a altura desde o primeiro render; o componente interno entra/sai com `opacity`/`translate-y` animados. Resolve o Requisito 9.1 diretamente e viabiliza Property 4 (altura constante). |
| `ConfirmButton` com **rótulo de largura máxima pré-alocada** via `min-w` + `w-full` do container | Ajuste de `font-variant-numeric: tabular-nums` + padding dinâmico | O botão ocupa 100% da largura do content slot (`w-full`), então a variação de rótulo não afeta a largura externa. Altura fixa via `h-10`. |
| Ícones via **SVG inline** minimal no JSX | `lucide-react` como dependência | O projeto atualmente não depende de `lucide-react`; adicionar ~60KB para 10 ícones decorativos não se justifica. SVGs inline de ~15 linhas cada, com `aria-hidden="true"`, ficam em `src/features/demo/components/icons/` e não impactam o bundle de forma significativa. Decisão reversível se mais telas usarem os mesmos ícones. |
| Animação de entrada da `ConfirmMessage` via **`@keyframes` Tailwind arbitrário** | `framer-motion` | Já temos a regra global `prefers-reduced-motion` em `src/index.css` que zera `animation-duration`. Uma única `@keyframes` local cumpre o Requisito 9.2/9.6 sem adicionar 60KB de biblioteca. |
| Novos subcomponentes: `StatusBar`, `AppHeader`, `HighlightBanner`, `BottomTabBar`, `AreaIcon` (5 novos arquivos) | Inline tudo no `MobileMockup` | Manter unidade de teste e leitura. Cada novo componente tem entre 20–50 linhas e responsabilidade única. |
| **Manter `DemoMorador`, `useDemoReservas`, `demoReducer` sem tocar** | Reescrever DemoMorador do zero | Requisito 11 é inegociável: a assinatura do hook e o comportamento do reducer precisam permanecer idênticos. Só o JSX renderizado muda. |

### Escopo e não-escopo

**Dentro do escopo:**
- `src/features/demo/DemoMorador.tsx` (refactor da estrutura de colunas)
- `src/features/demo/components/MobileMockup.tsx` (restruturação completa com slots fixos)
- `src/features/demo/components/AreaCard.tsx` (adição de ícone + estado informativo visualmente distinto)
- `src/features/demo/components/SlotGrid.tsx` (altura fixa, bloco informativo para Piscina, hierarquia de cores de estado)
- `src/features/demo/components/ConfirmButton.tsx` (largura e altura constantes, feedback de press)
- `src/features/demo/components/ConfirmMessage.tsx` (wrapper reservado, ícone de sucesso, animação)
- `src/features/demo/components/TimelineProximas.tsx` (uso estável na `Coluna_Narrativa`; polimento mínimo)
- **Novos**: `StatusBar.tsx`, `AppHeader.tsx`, `HighlightBanner.tsx`, `BottomTabBar.tsx`, `icons/AreaIcon.tsx`

**Fora do escopo:**
- Aba `DemoSindico` e qualquer coisa em `src/features/demo/components/sindico/`
- `DemoSection`, `DemoTabs` (apenas se um ajuste mínimo for necessário para o `role="tabpanel"` continuar funcionando após o refactor; qualquer mudança aqui precisa ser nula em comportamento)
- Estado da Demo: `demoReducer.ts`, `useDemoReservas.ts`, `derived.ts`, `types.ts`, `src/data/demoConfig.ts` — **intocados**
- Outras seções da Apresentacao (`Hero`, `Escopo`, `Cronograma`, `Investimento`, `Benchmark`, `Diferenciais`, `Aceite`)

## Architecture

### Diagrama de alto nível

```mermaid
graph TD
  DS[DemoSection] --> DT[DemoTabs]
  DS --> DM[DemoMorador<br/>2 colunas fixas]
  DM --> COL_ESQ[Coluna Esquerda<br/>Mockup centralizado]
  DM --> COL_DIR[Coluna Direita<br/>Narrativa de vendas]

  COL_ESQ --> MM[MobileMockup<br/>320×640px fixo<br/>grid-rows: 7 faixas]

  MM --> R1[Row 1 — StatusBar<br/>h-6]
  MM --> R2[Row 2 — AppHeader<br/>h-14]
  MM --> R3[Row 3 — HighlightBanner<br/>h-14]
  MM --> R4[Row 4 — AreaCardRow<br/>h-20]
  MM --> R5[Row 5 — SlotGrid<br/>h-52]
  MM --> R6[Row 6 — ConfirmSlot<br/>h-10 button + h-14 message = h-[88px]]
  MM --> R7[Row 7 — BottomTabBar<br/>h-14]

  R4 --> AC1[AreaCard Quadra]
  R4 --> AC2[AreaCard Deck]
  R4 --> AC3[AreaCard Piscina]

  R5 --> SG[SlotGrid altura fixa<br/>grid-cols-3 OU bloco Piscina]

  R6 --> CB[ConfirmButton w-full h-10]
  R6 --> CM[ConfirmMessage wrapper h-14<br/>conteúdo condicional animado]

  COL_DIR --> TN[Título + descrição]
  COL_DIR --> KPI[Mini-cards 2h / 24/7]
  COL_DIR --> TL[TimelineProximas]
  COL_DIR --> CTA[Botão 'Ver fluxo completo']
```

### Estratégia central: `MobileMockup` como grid CSS de altura fixa

O ponto crítico do Requisito 1 é que **nenhuma linha interna possa crescer** além do orçamento definido. Três mecanismos garantem isso:

1. **Container raiz do `MobileMockup`** usa `w-[320px] h-[640px] grid grid-rows-[24px_56px_56px_80px_208px_88px_56px]`. Os 7 valores somam exatamente 568px; os 72px restantes são absorvidos por borders (`border-4` = 8px total) e paddings do frame do celular.
2. **Cada linha tem `overflow: hidden`** ou `overflow-y: auto` explícito — conteúdo interno que passe do orçamento é recortado visualmente, nunca empurra a linha.
3. **ESLint custom rule ou teste automatizado** rejeita declarações `height: auto` e `min-height` no container raiz (Requisito 1.9). O mecanismo escolhido é um teste de integração (seção Testing Strategy), não uma regra de lint.

Os valores exatos das 7 faixas (`grid-template-rows: 24px 56px 56px 80px 208px 88px 56px`, total 568px + 72px de frame = 640px) são escolhidos a partir dos componentes internos previstos:

| Faixa | Conteúdo | Altura | Justificativa |
| --- | --- | --- | --- |
| 1 | `StatusBar` | 24px (`h-6`) | Padrão iOS status bar. |
| 2 | `AppHeader` | 56px (`h-14`) | Espaço para avatar (40×40) + texto em 2 linhas. |
| 3 | `HighlightBanner` | 56px (`h-14`) | Uma linha de texto + ícone. |
| 4 | `AreaCardRow` | 80px (`h-20`) | 3 cards com ícone 24px + nome + hint em 2 linhas. |
| 5 | `SlotGrid` | 208px (`h-52`) | Quadra = 5 linhas × 36px + 4 gaps × 8px = 212px; arredondado para 208px (linhas de 34px). Deck (3 linhas) e Piscina (bloco informativo) centralizam-se no mesmo espaço. |
| 6 | `ConfirmSlot` | 88px | `ConfirmButton` 40px + gap 8px + `ConfirmMessage` 40px slot reservado (conteúdo interno da message tem h-14 = 56px mas com `-mt-4` sobrepondo parcialmente o padding inferior do botão). **Alternativa mais simples:** 40px botão + 8px gap + 40px mensagem = 88px. Adotada. |
| 7 | `BottomTabBar` | 56px (`h-14`) | Padrão de tab bar mobile com ícone 24px + label 10px. |

**Nota sobre a faixa 5:** o número 208px foi recalculado para caber 5 linhas de slot com altura 32px + 4 gaps de 8px = 192px, mais 16px de padding vertical = 208px. Slots ficam em `h-8` (32px) ao invés de `py-1.5` variável. Essa escolha é validada na Testing Strategy como parte do teste de altura constante.

**Nota sobre a faixa 6:** os 88px comportam `ConfirmButton h-10` + `gap-2` + `ConfirmMessage h-10` empilhados verticalmente dentro de um subgrid. Quando não há confirmação, o espaço da mensagem fica visualmente vazio mas ocupado (fundo transparente, nenhum texto), garantindo o Requisito 9.1.

### Layout de duas colunas (`DemoMorador` container)

```
<div class="grid gap-8 md:grid-cols-[320px_1fr] items-start justify-items-center md:justify-items-start">
  {/* Coluna esquerda — mockup com width 320px fixo, centralizado na sua célula */}
  <MobileMockup>...</MobileMockup>

  {/* Coluna direita — narrativa ocupa o restante */}
  <div class="w-full max-w-md space-y-4">...</div>
</div>
```

- `grid-cols-[320px_1fr]` em ≥768px garante que a coluna esquerda tenha exatamente 320px e a direita expanda.
- `items-start` alinha ambas ao topo; como as duas têm altura mínima conhecida (mockup 640px, narrativa com blocos de altura fixa descrita abaixo), a estabilidade do Requisito 2 decorre naturalmente.
- Em `<768px`, `grid-cols-1` empilha (mockup primeiro, narrativa depois), o mockup mantém 320×640px, `justify-items-center` centraliza horizontalmente (Requisito 12.3).

### Estabilidade da `Coluna_Narrativa` (Requisito 2)

A narrativa tem 4 blocos verticais, todos com altura declarada ou naturalmente estável:

| Bloco | Altura | Observação |
| --- | --- | --- |
| Título (`h3`) + parágrafo | natural (~96px) | Texto fixo, não varia. |
| Mini-cards 2h / 24/7 | `h-20` (80px) | 2 cards em `grid-cols-2`. |
| `TimelineProximas` | `h-48` (192px) | 3 itens × `h-14` + `gap-2` + header `h-6` = ~192px. Itens são hardcoded. |
| Botão "Ver fluxo completo" + espaçador | ~40px | |

Como o estado da Demo **não afeta nenhum destes blocos**, o Requisito 2.2 (posição vertical constante) fica satisfeito sem esforço adicional.

### Estratégia de animação (Requisitos 6.5, 7.5, 8.5, 9.2)

Animações são puramente visuais, sempre respeitando `prefers-reduced-motion`:

- **Entrada da `ConfirmMessage`**: `@keyframes slide-in-up` com `translateY(8px) → 0` + `opacity 0 → 1`, `duration: 240ms`, `ease-out`. Declarado como `animation-name: slide-in-up` aplicado condicionalmente quando o componente monta com `ultimaConfirmacao !== null`.
- **Hover de `AreaCard` e `Slot` livre**: apenas `transition-colors duration-150` (150ms, Requisito 6.5 e 7.5).
- **Press do `ConfirmButton`**: `active:scale-[0.98] transition-transform duration-100`.
- A regra global em `src/index.css` (`@media (prefers-reduced-motion: reduce) { ... animation-duration: 0.01ms !important }`) já cobre o Requisito 9.6 sem mudança adicional.

### Tokens e paleta

Reutilizamos os tokens existentes (`src/styles/tokens.css`). Para a `BottomTabBar` e `HighlightBanner`, não introduzimos tokens novos — usamos:
- `bg-surface-dark` + `text-text-on-dark` para `StatusBar` e `AppHeader` (preservando o visual do `MobileMockup` atual).
- `bg-bg-secondary` + `text-text-primary` para a área de conteúdo claro (faixas 3–6).
- `bg-surface-dark` + `text-text-on-dark` para a `BottomTabBar` (faixa 7), com `accent-primary` no item ativo.
- `bg-accent-primary/10` + `border-accent-primary` para o `HighlightBanner` (destaque sutil).

Os estados do `Slot` ganham uma hierarquia mais forte (Requisito 7.1), mantendo todos os pares texto/fundo acima de 4,5:1:

| Estado | Fundo | Texto | Borda |
| --- | --- | --- | --- |
| `livre` não selecionado | `bg-bg-primary` (#fff) | `text-text-primary` (#0b1f3a, ~17:1) | `border-border-secondary` (#cbd5e1) |
| `livre` selecionado | `bg-accent-primary` (#1aab5a) | `text-text-on-dark` (#fff, 3:1 com peso 600 e tamanho 14px bold — qualifica como texto grande WCAG) | `border-accent-primary` |
| `ocupado` | `bg-bg-tertiary` (#e9edf3) | `text-text-tertiary` (#6b7280, ~4,7:1) com `line-through` | `border-border-primary` (#e2e8f0) |
| `fora-do-expediente` | `bg-bg-secondary` (#f4f6fa) + hachura diagonal leve via `bg-[image:...]` | `text-text-tertiary` (#6b7280, ~4,7:1) | `border-border-primary` |

A hachura diagonal (padrão `repeating-linear-gradient`) é o elemento visual que diferencia `fora-do-expediente` de `ocupado` (Requisito 7.1) sem depender só da palavra riscada.

## Components and Interfaces

### Árvore de componentes (pós-refactor)

```
DemoMorador (refactor)
├─ MobileMockup (reestruturado)
│  ├─ StatusBar              [novo, decorativo]
│  ├─ AppHeader              [novo, refatoração do header atual]
│  │  ├─ AreaIcon (avatar)
│  │  └─ BellIcon (com badge)
│  ├─ HighlightBanner        [novo, decorativo]
│  │  └─ InfoIcon
│  ├─ AreaCardRow            [container grid-cols-3]
│  │  └─ AreaCard × 3 (refatorado, agora com AreaIcon)
│  ├─ SlotGridSlot           [container h-52]
│  │  └─ SlotGrid (refatorado) OU PiscinaInfo (bloco informativo)
│  ├─ ConfirmSlot            [container h-[88px]]
│  │  ├─ ConfirmButton (refatorado)
│  │  └─ ConfirmMessageSlot  [container h-10 sempre presente]
│  │     └─ ConfirmMessage (refatorado, conteúdo condicional)
│  └─ BottomTabBar           [novo, decorativo]
└─ Coluna Narrativa (sem mudanças estruturais)
```

### Contratos dos componentes

#### `MobileMockup` (reestruturado)

```tsx
// src/features/demo/components/MobileMockup.tsx
export interface MobileMockupProps {
  /** Radiogroup dos 3 AreaCards. */
  readonly areaCards: ReactNode;
  /** Grade de slots OU bloco informativo (Piscina). */
  readonly slotArea: ReactNode;
  /** Botão de confirmação. */
  readonly confirmButton: ReactNode;
  /** Mensagem de confirmação (sempre presente como slot; interior pode ser null). */
  readonly confirmMessage: ReactNode;
}
```

O `MobileMockup` deixa de receber `children` livre e passa a receber 4 **slots nomeados**. Isso ancora a estrutura de 7 linhas no componente e impede que `DemoMorador` insira conteúdo arbitrário que corrompa o layout fixo. `StatusBar`, `AppHeader`, `HighlightBanner` e `BottomTabBar` são internos ao `MobileMockup` (não aceitam props — são puramente decorativos).

**Classes-chave:**
```tsx
<div
  className="grid w-[320px] h-[640px] grid-rows-[24px_56px_56px_80px_208px_88px_56px] overflow-hidden rounded-[2rem] border-4 border-gray-900 bg-surface-dark shadow-2xl mx-auto"
  data-testid="mobile-mockup"
  data-demo-frame
>
  <StatusBar />
  <AppHeader />
  <HighlightBanner />
  <div className="px-4 bg-bg-secondary flex items-center">{areaCards}</div>
  <div className="px-4 bg-bg-secondary" data-testid="slot-area">{slotArea}</div>
  <div className="px-4 bg-bg-secondary grid grid-rows-[40px_8px_40px]">
    {confirmButton}
    <div aria-hidden="true" />
    <div data-testid="confirm-message-slot" className="h-10 relative">{confirmMessage}</div>
  </div>
  <BottomTabBar />
</div>
```

O `data-testid="mobile-mockup"` e o `data-demo-frame` serão usados pelos testes de propriedade para extrair o elemento raiz e medir classes/atributos.

#### `StatusBar` (novo)

```tsx
// src/features/demo/components/StatusBar.tsx
export function StatusBar(): JSX.Element;
```

Sem props. Renderiza `<div aria-hidden="true" className="flex h-6 items-center justify-between px-4 bg-surface-dark text-text-on-dark text-[11px] font-semibold">`:
- Horário fixo: `9:41` (referência iOS, Requisito 3.1)
- Três mini-ícones SVG inline (12×12): sinal celular (4 barras), Wi-Fi (arco), bateria (retângulo) — Requisito 3.2
- Todo o bloco marcado `aria-hidden="true"` (Requisito 3.5)

#### `AppHeader` (novo)

```tsx
// src/features/demo/components/AppHeader.tsx
export function AppHeader(): JSX.Element;
```

Sem props. Altura fixa `h-14`:
- Lado esquerdo: avatar redondo 40×40 com iniciais "M" sobre `bg-accent-primary` (decorativo, `aria-hidden="true"`) + texto em duas linhas: `CASA 247 · BLOCO B` (uppercase, tracking-wider, 10px) e `Olá, morador 👋` (14px, font-medium).
- Lado direito: ícone de sino SVG 24×24 com badge circular vermelho (`bg-status-negative`) mostrando `3` (decorativo, `aria-hidden="true"`).

#### `HighlightBanner` (novo)

```tsx
// src/features/demo/components/HighlightBanner.tsx
export function HighlightBanner(): JSX.Element;
```

Sem props. Altura fixa `h-14`, conteúdo estático. Texto sugerido: **"Próxima reserva: Quadra hoje às 14:00"** com ícone de calendário SVG 16×16 à esquerda. Cor de fundo `bg-accent-primary/10`, borda `border-accent-primary/30`, texto `text-text-primary`. Ícone marcado `aria-hidden="true"` (Requisito 5.6) — o texto já comunica o mesmo significado.

#### `BottomTabBar` (novo)

```tsx
// src/features/demo/components/BottomTabBar.tsx
export function BottomTabBar(): JSX.Element;
```

Sem props. Altura fixa `h-14`, 4 itens iguais em grid `grid-cols-4`:

| Posição | Ícone | Rótulo | Estado |
| --- | --- | --- | --- |
| 1 | home | Home | ativo (`text-accent-primary`) |
| 2 | lista | Atividades | inativo (`text-text-tertiary`) |
| 3 | sino | Avisos | inativo |
| 4 | usuário | Perfil | inativo |

Todo o elemento raiz marcado `aria-hidden="true"` (Requisito 10.7). Nenhum dos 4 itens responde a clique (Requisito 10.8) — renderizados como `<div>` sem `onClick`, não como `<button>`. Assim, não entram no fluxo de foco por teclado (Requisito 12.7).

#### `AreaCard` (refatorado)

```tsx
// src/features/demo/components/AreaCard.tsx — assinatura inalterada
export interface AreaCardProps {
  readonly area: AreaConfig;
  readonly selecionada: boolean;
  readonly onClick: () => void;
}
```

A assinatura **não muda** (Requisito 11). Apenas o JSX interno:

- Altura fixa `h-16` garantida via `flex flex-col justify-between` + classes de tamanho internas.
- Ícone 24×24 no topo esquerdo via componente auxiliar `<AreaIcon id={area.id} />` (decorativo, `aria-hidden="true"`, Requisito 6.2).
- Nome da área (`text-xs font-semibold`) abaixo do ícone.
- Badge "Informativa" (quando `!area.reservavel`) deslocado para o canto superior direito com borda e fundo distintos (Requisito 6.7).
- Estado selecionado: `border-accent-primary border-2` + fundo `bg-accent-primary/10` (Requisito 6.4). A espessura da borda aumenta de 1px para 2px mas o impacto no layout é absorvido pelo `box-sizing: border-box` do Tailwind.
- Hover apenas em `reservavel === true`: `hover:bg-bg-tertiary hover:border-border-secondary` dentro de `transition-colors duration-150`.

#### `AreaIcon` (novo)

```tsx
// src/features/demo/components/icons/AreaIcon.tsx
export interface AreaIconProps {
  readonly id: AreaId;
  readonly className?: string;
}
export function AreaIcon({ id, className }: AreaIconProps): JSX.Element;
```

Mapa `id → SVG inline`:
- `quadra`: ícone de bola de vôlei (círculo com 3 curvas internas)
- `deck`: ícone de deck/churrasqueira (retângulo com chama)
- `piscina`: ícone de onda/gota

Todos 24×24 viewBox, `fill="currentColor"`, `aria-hidden="true"`.

#### `SlotGrid` (refatorado)

```tsx
// src/features/demo/components/SlotGrid.tsx — assinatura inalterada
export interface SlotGridProps {
  readonly slotsComStatus: readonly SlotComStatus[];
  readonly slotSelecionado: Slot | null;
  readonly onSelect: (slot: Slot) => void;
}
```

Mudanças internas:

1. **Wrapper de altura fixa `h-52 overflow-hidden`** em ambos os caminhos (grid e bloco informativo).
2. **Grade para áreas reserváveis**: `grid grid-cols-3 gap-2 auto-rows-[32px]`; primeiras 5 linhas visíveis (ou 3, para Deck). Quadra com 14 slots ocupa `ceil(14/3) = 5` linhas.
3. **Bloco informativo (Piscina)** agora é um card vertical centralizado com ícone `PiscinaIcon` 48×48 no topo, título **"Piscina"** e texto explicativo em duas linhas. Ocupa o `h-52` completo (`flex items-center justify-center`).
4. Estados `livre`, `ocupado`, `fora-do-expediente`, `selecionado` com as cores da tabela acima.
5. A hachura diagonal para `fora-do-expediente` é implementada via `background-image: repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.04) 4px 8px)`.

**Preservação de ARIA** (Requisito 7.6):
- `role="group"` no wrapper quando há grade, `aria-label="Grade de horários disponíveis"`.
- `aria-pressed={selecionado}` nos slots livres.
- `aria-label="HH:MM — ocupado"` em slots ocupados.
- `aria-label="HH:MM — fora do horário"` + `title="Fora do horário"` em slots fora do expediente.
- Piscina: `role="note"` no bloco informativo, sem `role="group"`.

#### `ConfirmButton` (refatorado)

```tsx
// src/features/demo/components/ConfirmButton.tsx — assinatura inalterada
export interface ConfirmButtonProps {
  readonly podeConfirmar: boolean;
  readonly slotSelecionado: Slot | null;
  readonly fim: Slot | null;
  readonly onConfirm: () => void;
}
```

Mudanças:

1. Classes-chave garantem largura e altura constantes:
   ```
   w-full h-10 min-h-10 max-h-10 flex items-center justify-center
   ```
   (`w-full` herdado do slot do `MobileMockup`, que tem largura fixa `320px - 32px de padding = 288px`.)

2. Conteúdo:
   - Habilitado: ícone de check 16×16 à esquerda + `Reservar HH:MM – HH:MM` em negrito, fundo `bg-accent-primary`, texto `text-text-on-dark`.
   - Desabilitado: texto `Selecione um horário` em itálico, fundo `bg-bg-tertiary`, texto `text-text-tertiary`. Sem ícone.

3. Feedback de press via `active:scale-[0.98] transition-transform duration-100` (Requisito 8.5).

4. Preserva `focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2` (Requisito 8.6).

#### `ConfirmMessage` (refatorado)

```tsx
// src/features/demo/components/ConfirmMessage.tsx — assinatura inalterada
export interface ConfirmMessageProps {
  readonly ultimaConfirmacao: UltimaConfirmacao | null;
}
```

Mudanças:

1. **Importante**: o componente continua retornando `null` quando `ultimaConfirmacao === null`. O **wrapper de altura reservada vive no `MobileMockup`** (`data-testid="confirm-message-slot"` com `h-10`). Isso é o que satisfaz o Requisito 9.1 sem criar um componente "invisível mas ocupando espaço" dentro da própria `ConfirmMessage`.

2. Quando `ultimaConfirmacao !== null`, renderiza:
   ```tsx
   <div
     role="status"
     aria-live="polite"
     className="h-10 flex items-center gap-2 rounded-md border border-accent-primary bg-accent-primary/10 px-2 text-xs text-accent-primary animate-[slide-in-up_240ms_ease-out]"
   >
     <CheckIcon aria-hidden="true" className="w-4 h-4 shrink-0" />
     <span>Reserva confirmada: {areaNome} das {slot} às {fim}.</span>
   </div>
   ```

3. A animação `slide-in-up` é definida no `tailwind.config.js` via `theme.extend.keyframes` e `theme.extend.animation`. Como a regra global `prefers-reduced-motion` zera `animation-duration: 0.01ms`, o Requisito 9.6 fica satisfeito automaticamente.

4. Preserva `role="status"` e `aria-live="polite"` (Requisito 9.4).

#### `DemoMorador` (refactor)

```tsx
// src/features/demo/DemoMorador.tsx — assinatura inalterada
export interface DemoMoradorProps {
  readonly demo: UseDemoReservasReturn;
}
```

Mudanças:

1. Container externo passa a `grid md:grid-cols-[320px_1fr] gap-8 items-start justify-items-center md:justify-items-start`.
2. Construção da árvore passa a entregar os 4 slots nomeados ao `MobileMockup`:
   ```tsx
   <MobileMockup
     areaCards={<div role="radiogroup" aria-label="Escolha uma área comum" className="grid grid-cols-3 gap-2 w-full">...</div>}
     slotArea={<SlotGrid ... />}
     confirmButton={<ConfirmButton ... />}
     confirmMessage={<ConfirmMessage ... />}
   />
   ```
3. A coluna direita mantém estrutura atual de título + mini-cards + `TimelineProximas` + botão "Ver fluxo completo".

A lógica de dispatch para o reducer (`demo.dispatch({ type: 'SELECT_AREA', area })` etc.) permanece idêntica byte-a-byte.

### Ícones (SVGs inline)

Cria-se a pasta `src/features/demo/components/icons/` com:
- `AreaIcon.tsx` — ícone por `AreaId` (quadra, deck, piscina)
- `CheckIcon.tsx` — círculo com check
- `BellIcon.tsx` — sino
- `InfoIcon.tsx` — informação (i em círculo)
- `SignalIcon.tsx`, `WifiIcon.tsx`, `BatteryIcon.tsx` — status bar
- `HomeIcon.tsx`, `ListIcon.tsx`, `UserIcon.tsx` — tab bar (`BellIcon` é reutilizado)

Cada ícone é um componente funcional de ~10 linhas, `fill="currentColor"`, tamanho parametrizado por `className` (default `w-4 h-4`), todo marcado `aria-hidden="true"` no elemento raiz.

## Data Models

Nenhum dado novo é introduzido. Todos os textos decorativos são constantes embutidas nos componentes visuais:

```ts
// StatusBar
const HORARIO_FICTICIO = '9:41';

// AppHeader
const UNIDADE_MORADOR = 'CASA 247 · BLOCO B';
const SAUDACAO = 'Olá, morador 👋';
const BADGE_NOTIFICACOES = 3;

// HighlightBanner
const BANNER_TEXTO = 'Próxima reserva: Quadra hoje às 14:00';

// BottomTabBar
interface TabItem {
  readonly id: 'home' | 'atividades' | 'avisos' | 'perfil';
  readonly label: string;
  readonly ativo: boolean;
}
const TABS: readonly TabItem[] = [
  { id: 'home', label: 'Home', ativo: true },
  { id: 'atividades', label: 'Atividades', ativo: false },
  { id: 'avisos', label: 'Avisos', ativo: false },
  { id: 'perfil', label: 'Perfil', ativo: false },
];
```

Cada constante vive no próprio componente que a consome. Não criamos um `demoMoradorCopy.ts` agregador porque cada texto é consumido por apenas um componente e agrupá-los criaria acoplamento desnecessário.

**Nenhuma mudança em**:
- `src/data/demoConfig.ts` — o catálogo `AREAS`, `KPIS_SINDICO`, `ACOES_RAPIDAS_SINDICO`, `ULTIMAS_RESERVAS_MOCK` permanecem.
- `src/features/demo/types.ts` — `DemoState`, `DemoAction`, `UltimaConfirmacao`, `StatusSlot`, `SlotComStatus`, `initialDemoState` permanecem.
- `src/features/demo/demoReducer.ts` — reducer puro permanece intocado.
- `src/features/demo/derived.ts` — helpers derivados permanecem intocados.
- `src/features/demo/useDemoReservas.ts` — hook permanece intocado.

## Correctness Properties



_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Aplicabilidade de PBT

PBT é parcialmente aplicável a esta feature. O núcleo de lógica (`demoReducer`, `derived.ts`, `useDemoReservas`) **não é alterado**, então as Properties 3–8 do spec pai `apresentacao-interativa-vendas` continuam valendo sem ajustes. O que é novo aqui são **invariantes estruturais do DOM** que precisam valer para qualquer estado produzido pelo reducer — e isso é precisamente onde PBT agrega valor: geramos sequências aleatórias de `DemoAction`, aplicamos via `reduce(demoReducer, initialDemoState, actions)`, renderizamos `<DemoMorador>` com React Testing Library e verificamos invariantes do DOM (classes, presença de elementos, atributos ARIA).

Em jsdom o layout real não é computado (`getBoundingClientRect` retorna zero), então dimensões "em pixels" são verificadas indiretamente via `className` — que é o contrato determinístico entre o componente React e o navegador. Se o `className` do `[data-demo-frame]` contém `w-[320px] h-[640px]` e `grid-template-rows` fixo em todos os estados, então no navegador a altura real é constante.

Critérios com classificação `SMOKE` (ex.: preservação da assinatura do hook) são garantidos por **não editar o arquivo** — não precisam de teste runtime. A verificação é diff estrutural em code review.

### Reflexão sobre redundância

Agrupei os 13 acceptance criteria classificados como `PROPERTY` no prework em 4 propriedades consolidadas, eliminando sobreposições:

- **Req 1.3, 1.4, 1.5, 1.6, 3.4, 4.6, 5.4, 8.1, 8.2, 9.1, 10.1, 10.6, 13.2, 13.3, 13.4, 13.6** — todos afirmam alguma variação de "para todo estado, a estrutura de altura/largura de uma faixa específica do mockup é constante". Consolidados em uma única **Property 1: Layout invariante do MobileMockup**, que verifica o esqueleto completo do grid de 7 linhas + classes de altura/largura de cada slot interno. Testar cada requisito isoladamente seria redundante porque todos dependem das mesmas classes CSS declaradas.
- **Req 6.3** (altura igual dos 3 cards) e **Req 6.4** (altura constante ao selecionar) — 6.4 é subsumida por 6.3: se os 3 cards têm altura `h-16` em qualquer estado (incluindo selecionado), a altura do selecionado é constante. Uma única **Property 2** cobre os dois.
- **Req 12.7** — decorativos fora do fluxo de foco. Como é uma propriedade universal sobre sequências de ações (nenhum handler de tab bar ou header pode criar um tabindex>=0 em tempo de execução), vira **Property 3: Decorativos não focáveis**.
- **Req 9.5** — texto paramétrico da `ConfirmMessage`. A estrutura `"Reserva confirmada: <area> das <slot> às <fim>."` precisa valer para todo par `(area, slot)` válido, não apenas os 3 exemplos. Vira **Property 4: Texto da ConfirmMessage**.

Outros requisitos marcados como `PROPERTY` no prework (`13.1 = 11.3`, `13.2 = 1.3`, etc.) são duplicatas explícitas e foram todos absorvidos. `13.5` (testes existentes continuam passando) é verificado pela suíte CI, não por uma propriedade nova.

### Property 1: Layout invariante do MobileMockup

*For any* sequência finita de `DemoAction` aplicada sobre `initialDemoState` via `reduce(demoReducer, ...)`, ao renderizar `<DemoMorador demo={makeFakeHook(state)} />`, o elemento raiz `[data-demo-frame]` e todos os slots internos do mockup SHALL expor `className` com as declarações dimensionais fixas esperadas:

- `[data-demo-frame]`: classes contendo `w-[320px]`, `h-[640px]`, `grid-rows-[24px_56px_56px_80px_208px_88px_56px]`.
- `[data-testid="status-bar"]`: classe `h-6`.
- `[data-testid="app-header"]`: classe `h-14`.
- `[data-testid="highlight-banner"]`: classe `h-14`.
- `[data-testid="slot-area"]`: classe `h-52`.
- `[data-testid="confirm-button"]`: classes `w-full` e `h-10`.
- `[data-testid="confirm-message-slot"]`: classe `h-10` (sempre presente, independente de `ultimaConfirmacao`).
- `[data-testid="bottom-tab-bar"]`: classe `h-14` (sempre presente).

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.4, 4.6, 5.4, 7.3, 8.1, 8.2, 9.1, 10.1, 10.6, 13.2, 13.3, 13.4, 13.6**

### Property 2: AreaCards compartilham altura constante

*For any* sequência finita de `DemoAction` aplicada sobre `initialDemoState`, ao renderizar `<DemoMorador demo={makeFakeHook(state)} />`, os 3 elementos `[role="radio"]` descendentes de `[role="radiogroup"]` SHALL todos expor `className` contendo `h-16`, independentemente de qual área esteja selecionada ou se o usuário interagiu com os cards.

**Validates: Requirements 6.3, 6.4**

### Property 3: Elementos decorativos fora do fluxo de foco

*For any* sequência finita de `DemoAction` aplicada sobre `initialDemoState`, ao renderizar `<DemoMorador demo={makeFakeHook(state)} />`, os containers decorativos `[data-testid="status-bar"]`, `[data-testid="app-header"]`, `[data-testid="highlight-banner"]` e `[data-testid="bottom-tab-bar"]` SHALL não conter nenhum elemento focável (nenhum `<button>`, `<a>`, `<input>`, ou elemento com `tabindex >= 0`).

**Validates: Requirements 10.7, 10.8, 12.7**

### Property 4: Texto da ConfirmMessage

*For any* `UltimaConfirmacao` válida construída a partir de uma área reservável (`area ∈ {'quadra', 'deck'}`), um slot `s ∈ AREAS[area].slotsBase` que satisfaça `addHoras(s, AREAS[area].duracaoMaxHoras) ≤ closingToMinutes(AREAS[area].fechamentoDiaUtil)`, e `fim = fimComoSlot(addHoras(s, AREAS[area].duracaoMaxHoras))`, ao renderizar `<ConfirmMessage ultimaConfirmacao={{ area, slot: s, fim }} />`, o elemento `[role="status"]` resultante SHALL conter, em seu conteúdo textual:

- A string `AREAS[area].nome`
- A string `s` (no formato `HH:MM`)
- A string `fim` (no formato `HH:MM`)
- O prefixo `"Reserva confirmada"`

**Validates: Requirements 9.5**

## Error Handling

Esta feature não introduz novas fontes de erro runtime — todo o comportamento é herdado do reducer puro já coberto pelas Properties 3–8 do spec pai. Os cenários de borda relevantes são estruturais (construção de estado inválido) e estão elencados abaixo:

| Fonte de erro | Tratamento |
| --- | --- |
| Estado externo com `slotSelecionado` em área não-reservável (ex.: Piscina) | O helper `podeConfirmar` retorna `false` (já testado via Property 8 do spec pai), o `ConfirmButton` fica desabilitado, e o reducer no-op qualquer `CONFIRM`. Nenhuma mensagem de confirmação aparece. |
| `ultimaConfirmacao` com `area: 'piscina'` construída fora do reducer | `ConfirmMessage` renderiza o texto com `AREAS['piscina'].nome = 'Piscina'`. Não é um cenário produzível pelo reducer (Property 8 garante), mas se ocorrer, o componente não falha — apenas exibe a mensagem "Reserva confirmada: Piscina das HH:MM às HH:MM.". Em produção não deve ocorrer. |
| `SlotGrid` recebe `slotsComStatus` vazio | O wrapper `h-52` renderiza o bloco informativo "Piscina" como fallback. Defesa extra para o caso de uma área nova com `slotsBase === []`. |
| `AreaIcon` com `id` não mapeado | O `AreaIcon` usa `switch (id)` exhaustivo sobre `AreaId`. Se uma nova `AreaId` for adicionada ao `demoConfig.ts` sem atualizar o `AreaIcon`, o TypeScript emite erro de compilação (discriminated union). Não há comportamento runtime de fallback — é preferível falhar o build. |
| `prefers-reduced-motion` ativo | A regra global em `src/index.css` zera `animation-duration` para todos os elementos. A `ConfirmMessage` aparece instantaneamente sem animação perceptível. Sem tratamento adicional necessário. |
| Viewport < 320px | O mockup mantém 320px de largura, o que pode causar overflow horizontal em viewports extremamente estreitos (raros em 2026). `DemoMorador` usa `overflow-x: hidden` no container pai da seção para evitar scrollbars horizontais na página inteira. |
| Re-render disparado por `useDemoReservas` | O hook já memoiza derivações; o `MobileMockup` não recebe `children` variáveis. Re-renders são benignos. |

Nenhum estado do `DemoState` é capaz de produzir um DOM sem o mockup renderizado — se o `demo.state` é válido (construído pelo reducer), todos os 7 slots do grid aparecem. Isso é o que sustenta as Properties 1, 2 e 3 como propriedades universais sobre sequências de ações.

## Testing Strategy

### Ferramentas (já no projeto)

- **Vitest 2.1** com ambiente `jsdom` — runner único.
- **@fast-check/vitest 0.1.6** — integração de property-based testing com Vitest.
- **fast-check 3.23** — geradores e runner de PBT.
- **React Testing Library 16.3** + `user-event 14.6` — queries por role/label.
- **@axe-core/react 4.11** + `axe-core 4.11` — auditoria de acessibilidade.

Nenhuma nova dependência é necessária.

### Organização

Testes novos e atualizados ficam em `src/features/demo/__tests__/`:

```
src/features/demo/__tests__/
├─ DemoSection.test.tsx            # existente — atualizar queries (section-mockup reestruturada)
├─ demoReducer.test.ts             # existente — não muda
├─ demoReducer.pbt.test.ts         # existente — não muda
├─ DemoMorador.layout.pbt.test.tsx # NOVO — Properties 1, 2, 3 consolidadas via fast-check
├─ ConfirmMessage.pbt.test.tsx     # NOVO — Property 4
├─ MobileMockup.test.tsx           # NOVO — smoke tests de estrutura estática (status bar, tab bar, header)
└─ axe.integration.test.tsx        # NOVO — auditoria de contraste/a11y via axe-core
```

### Estratégia para as Properties 1–4

#### Fake hook para isolamento em PBT

Testes PBT que renderizam `<DemoMorador>` precisam receber um `demo: UseDemoReservasReturn` construído a partir de um `DemoState` arbitrário (não de um `useReducer` real). Criamos uma helper:

```tsx
// src/features/demo/__tests__/helpers/makeFakeDemoHook.ts
import { slotsComStatus, fimDaReservaSelecionada, podeConfirmar } from '../../derived';
import type { DemoState } from '../../types';
import type { UseDemoReservasReturn } from '../../useDemoReservas';

export function makeFakeDemoHook(state: DemoState): UseDemoReservasReturn {
  return {
    state,
    dispatch: () => {}, // no-op: PBT não exerce interação
    slotsComStatus: slotsComStatus(state, state.areaSelecionada),
    fimDaReservaSelecionada: fimDaReservaSelecionada(state),
    podeConfirmar: podeConfirmar(state),
  };
}
```

Isso evita montar um `useReducer` real, permitindo gerar estados arbitrários.

#### Gerador de sequências de ações

```tsx
import fc from 'fast-check';
import { AREAS_ARR } from '../types';
import { AREAS } from '@/data/demoConfig';

const allSlots = Array.from(new Set(AREAS_ARR.flatMap((id) => AREAS[id].slotsBase)));

const demoActionArb = fc.oneof(
  fc.record({ type: fc.constant('SWITCH_VIEW'), view: fc.constantFrom('morador', 'sindico') }),
  fc.record({ type: fc.constant('SELECT_AREA'), area: fc.constantFrom(...AREAS_ARR) }),
  fc.record({ type: fc.constant('SELECT_SLOT'), slot: fc.constantFrom(...allSlots) }),
  fc.record({ type: fc.constant('CONFIRM') }),
  fc.record({ type: fc.constant('RESET') }),
);

const actionSequenceArb = fc.array(demoActionArb, { minLength: 0, maxLength: 20 });
```

#### Property 1 — teste

```tsx
// Feature: demo-morador-mvp-polish, Property 1: Layout invariante do MobileMockup
// *For any* sequência finita de DemoAction aplicada sobre initialDemoState, o mockup mantém dimensões e classes fixas.
import { test } from '@fast-check/vitest';
import { render, cleanup } from '@testing-library/react';

test.prop([actionSequenceArb])(
  'MobileMockup mantém classes dimensionais em qualquer estado',
  (actions) => {
    const finalState = actions.reduce(demoReducer, initialDemoState);
    const { container } = render(<DemoMorador demo={makeFakeDemoHook(finalState)} />);

    const frame = container.querySelector('[data-demo-frame]');
    expect(frame).not.toBeNull();
    expect(frame!.className).toContain('w-[320px]');
    expect(frame!.className).toContain('h-[640px]');
    expect(frame!.className).toContain('grid-rows-[24px_56px_56px_80px_208px_88px_56px]');

    for (const [testId, expectedClass] of [
      ['status-bar', 'h-6'],
      ['app-header', 'h-14'],
      ['highlight-banner', 'h-14'],
      ['slot-area', 'h-52'],
      ['confirm-message-slot', 'h-10'],
      ['bottom-tab-bar', 'h-14'],
    ] as const) {
      const el = container.querySelector(`[data-testid="${testId}"]`);
      expect(el, `missing ${testId}`).not.toBeNull();
      expect(el!.className).toContain(expectedClass);
    }

    const cb = container.querySelector('[data-testid="confirm-button"]');
    expect(cb!.className).toContain('w-full');
    expect(cb!.className).toContain('h-10');

    cleanup();
  },
  { numRuns: 100 },
);
```

#### Property 2 — teste

```tsx
// Feature: demo-morador-mvp-polish, Property 2: AreaCards compartilham altura constante
test.prop([actionSequenceArb])(
  'os 3 AreaCards têm classe h-16 em qualquer estado',
  (actions) => {
    const finalState = actions.reduce(demoReducer, initialDemoState);
    const { container } = render(<DemoMorador demo={makeFakeDemoHook(finalState)} />);
    const cards = container.querySelectorAll('[role="radio"]');
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card.className).toContain('h-16');
    });
    cleanup();
  },
  { numRuns: 100 },
);
```

#### Property 3 — teste

```tsx
// Feature: demo-morador-mvp-polish, Property 3: Elementos decorativos fora do fluxo de foco
const FOCUSABLE = 'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])';

test.prop([actionSequenceArb])(
  'status bar, header, banner e tab bar não contêm elementos focáveis',
  (actions) => {
    const finalState = actions.reduce(demoReducer, initialDemoState);
    const { container } = render(<DemoMorador demo={makeFakeDemoHook(finalState)} />);
    for (const testId of ['status-bar', 'app-header', 'highlight-banner', 'bottom-tab-bar']) {
      const el = container.querySelector(`[data-testid="${testId}"]`)!;
      const focusable = el.querySelectorAll(FOCUSABLE);
      expect(focusable.length, `${testId} has focusable`).toBe(0);
    }
    cleanup();
  },
  { numRuns: 100 },
);
```

#### Property 4 — teste

```tsx
// Feature: demo-morador-mvp-polish, Property 4: Texto da ConfirmMessage
import { AREAS } from '@/data/demoConfig';
import { addHoras, closingToMinutes, fimComoSlot } from '../demoReducer';

const reservableArea = fc.constantFrom('quadra', 'deck');
const ultimaConfirmacaoArb = reservableArea.chain((area) => {
  const cfg = AREAS[area];
  const fechamento = closingToMinutes(cfg.fechamentoDiaUtil);
  const valid = cfg.slotsBase.filter(
    (s) => addHoras(s, cfg.duracaoMaxHoras) <= fechamento,
  );
  return fc.constantFrom(...valid).map((slot) => ({
    area,
    slot,
    fim: fimComoSlot(addHoras(slot, cfg.duracaoMaxHoras)),
  }));
});

test.prop([ultimaConfirmacaoArb])(
  'ConfirmMessage mostra nome da área, slot e fim',
  (uc) => {
    render(<ConfirmMessage ultimaConfirmacao={uc} />);
    const status = screen.getByRole('status');
    expect(status.textContent).toContain('Reserva confirmada');
    expect(status.textContent).toContain(AREAS[uc.area].nome);
    expect(status.textContent).toContain(uc.slot);
    expect(status.textContent).toContain(uc.fim);
    cleanup();
  },
  { numRuns: 100 },
);
```

### Testes não-PBT (unit, snapshot, smoke)

#### `MobileMockup.test.tsx` (novo — smoke estrutural)

- Renderiza `<MobileMockup areaCards={...} slotArea={...} confirmButton={...} confirmMessage={null} />` com slots mínimos.
- Verifica presença de `[data-testid="status-bar"]`, `[data-testid="app-header"]`, `[data-testid="highlight-banner"]`, `[data-testid="bottom-tab-bar"]`.
- Verifica que `StatusBar` contém o texto `9:41`.
- Verifica que `AppHeader` contém `CASA 247 · BLOCO B` e `Olá, morador 👋`.
- Verifica que `BottomTabBar` tem 4 descendentes com rótulos `Home`, `Atividades`, `Avisos`, `Perfil`.
- Verifica que todos os 4 containers decorativos têm `aria-hidden="true"` no elemento raiz OU seus filhos decorativos têm `aria-hidden="true"`.

#### `DemoSection.test.tsx` (existente — ajustar)

Testes atuais que consultam `screen.getByText('CASA 247 · BLOCO B')` continuam funcionando porque o `AppHeader` preserva o rótulo. Os demais asserts (`aria-selected` das tabs, fluxo de reserva 09:00 → confirmação, slot 10:00 ocupado do seed, slot 21:00 fora do horário, seleção de Piscina) não dependem de classes CSS específicas e devem continuar passando após a refactor visual.

Um ajuste esperado: o teste `selecionar Piscina esconde a grade e mostra a mensagem informativa` buscava o texto exato `informativa — não aceita reservas via app`. Como o novo bloco informativo da Piscina tem texto reestruturado (título **"Piscina"** + explicação em duas linhas), o teste será atualizado para usar um matcher mais flexível (`/informativa|não aceita reservas/i`) ou buscar por `role="note"`.

#### `axe.integration.test.tsx` (novo)

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'; // se necessário instalar, senão axe-core direto
// ou: import { run } from 'axe-core';

it('DemoMorador não tem violações WCAG AA', async () => {
  const { container } = render(<DemoMorador demo={makeFakeDemoHook(initialDemoState)} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Se `jest-axe` não for desejável como nova dependência, usar `axe-core` diretamente:

```tsx
import axe from 'axe-core';

it('DemoMorador não tem violações WCAG AA', async () => {
  const { container } = render(<DemoMorador demo={makeFakeDemoHook(initialDemoState)} />);
  const results = await axe.run(container, { runOnly: ['wcag2aa'] });
  expect(results.violations).toEqual([]);
});
```

Cobre: contraste de `Status_Bar`, `Header`, `Banner_Destaque`, `AreaCard`s, slots, `ConfirmButton`, `ConfirmMessage`, `BottomTabBar` em uma única varredura (Requisitos 3.6, 5.5, 7.7, 8.4, 10.9, 12.4).

### Configuração do Tailwind

A animação `slide-in-up` precisa ser registrada em `tailwind.config.js`:

```js
theme: {
  extend: {
    keyframes: {
      'slide-in-up': {
        '0%': { opacity: '0', transform: 'translateY(8px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      'slide-in-up': 'slide-in-up 240ms ease-out',
    },
  },
},
```

Validado implicitamente pelo Property 1 (a classe `animate-[slide-in-up_240ms_ease-out]` ou `animate-slide-in-up` existe no JSX e é reconhecida pelo JIT).

### Convenções para PBT

- `numRuns: 100` para as Properties 1, 2, 3, 4 (cada render de `<DemoMorador>` leva ~50ms em jsdom; 100 × 50ms ≈ 5s por property, aceitável).
- Cada property test inicia com o comentário tag `// Feature: demo-morador-mvp-polish, Property N: <título>`.
- `cleanup()` entre iterações para evitar acúmulo de DOM.
- Shrinking ativo (default do fast-check) para encontrar sequências mínimas em caso de falha.
- `fc.pre(...)` não é necessário — todas as sequências geradas produzem estados válidos porque `demoReducer` é no-op em ações inválidas.

### CI

A configuração de CI atual (em `.github/workflows/` — fora do escopo de edição aqui) já roda `pnpm test:run` em PRs. Os novos testes serão incluídos automaticamente pela convenção de naming (`*.test.ts` / `*.pbt.test.ts`).

### Checklist de verificação ao implementar

- [ ] `demoReducer.ts`, `useDemoReservas.ts`, `derived.ts`, `types.ts`, `demoConfig.ts` — byte-idênticos ao pré-feature (Requisito 11.1–11.4).
- [ ] Classes `w-[320px]`, `h-[640px]`, `grid-rows-[24px_56px_56px_80px_208px_88px_56px]` no `[data-demo-frame]`.
- [ ] `[data-testid]` em todos os slots internos para os testes PBT acessarem.
- [ ] `aria-hidden="true"` em `StatusBar`, `AppHeader` (elementos decorativos internos), `HighlightBanner` (ícone), `BottomTabBar`.
- [ ] `role="radiogroup"` com 3 `role="radio"` preservados no container dos `AreaCard`.
- [ ] `role="group"` no `SlotGrid` para áreas reserváveis.
- [ ] `role="status"` + `aria-live="polite"` preservados na `ConfirmMessage`.
- [ ] `@keyframes slide-in-up` registrado no `tailwind.config.js`.
- [ ] `DemoSection.test.tsx` — teste de Piscina atualizado se o texto mudou.
- [ ] `axe.integration.test.tsx` — nenhuma violação.
- [ ] 4 property tests passam com 100 iterações cada.


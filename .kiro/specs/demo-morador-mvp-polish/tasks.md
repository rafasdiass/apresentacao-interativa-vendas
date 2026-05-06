# Implementation Plan: Polimento da Demo do Morador (visual de MVP)

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

A implementação é estritamente **UI-only**: `demoReducer.ts`, `useDemoReservas.ts`, `derived.ts`, `types.ts` e `src/data/demoConfig.ts` permanecem byte-idênticos ao estado pré-feature (Requisito 11). Os blocos são organizados em ordem de dependência:

1. **Base** — keyframe Tailwind e biblioteca de ícones SVG inline (pré-requisitos usados por todos os componentes visuais).
2. **Componentes decorativos** do mockup (`StatusBar`, `AppHeader`, `HighlightBanner`, `BottomTabBar`) — cada um isolado e sem props.
3. **Refactor do `MobileMockup`** para a casca de 7 linhas fixas + 4 slots nomeados. Inclui smoke test estrutural.
4. **Refactor dos 4 componentes de conteúdo** (`AreaCard`, `SlotGrid`, `ConfirmButton`, `ConfirmMessage`) com assinaturas preservadas.
5. **Refactor do container `DemoMorador`** para entregar os slots ao mockup novo e manter a chamada ao reducer intocada.
6. **Checkpoint visual**.
7. **Infraestrutura de testes** (helper `makeFakeDemoHook` + arbitrários fast-check compartilhados).
8. **Testes novos** — Properties P1–P4 + axe integration (sub-tasks opcionais).
9. **Ajuste dos testes existentes** afetados pelo novo markup.
10. **Checkpoint final** de preservação byte-a-byte e suíte verde.

Sub-tasks marcadas com `*` são opcionais (testes). Cada property test novo referencia a Property correspondente do Design e os acceptance criteria que ela valida.

## Tasks

- [x] 1. Preparar base: keyframes Tailwind e pasta de ícones SVG
  - [x] 1.1 Registrar animação `slide-in-up` no `tailwind.config.js`
    - Adicionar `theme.extend.keyframes['slide-in-up']` com `0% { opacity: 0; transform: translateY(8px) }` → `100% { opacity: 1; transform: translateY(0) }`
    - Adicionar `theme.extend.animation['slide-in-up'] = 'slide-in-up 240ms ease-out'`
    - Nenhuma outra chave em `theme.extend` é alterada (preserva tokens de cor e tipografia existentes)
    - _Requirements: 9.2, 9.6_
  - [x] 1.2 Criar biblioteca de ícones SVG inline em `src/features/demo/components/icons/`
    - Criar `AreaIcon.tsx` com `interface AreaIconProps { readonly id: AreaId; readonly className?: string }` e `switch (id)` exhaustivo sobre `AreaId` renderizando SVG próprio para `quadra` (bola), `deck` (retângulo com chama) e `piscina` (onda)
    - Criar `CheckIcon.tsx`, `BellIcon.tsx`, `InfoIcon.tsx`, `SignalIcon.tsx`, `WifiIcon.tsx`, `BatteryIcon.tsx`, `HomeIcon.tsx`, `ListIcon.tsx`, `UserIcon.tsx` — cada um como `function ComponentName({ className }: { readonly className?: string }): JSX.Element` com `<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">` como default
    - Cada ícone ≈ 10 linhas, `fill="currentColor"` para herdar cor do container, `aria-hidden="true"` no elemento raiz
    - _Requirements: 3.2, 3.5, 4.3, 4.4, 5.3, 5.6, 6.1, 6.2, 7.8, 9.3, 10.3_

- [x] 2. Criar componentes decorativos do MobileMockup (sem props, internos ao mockup)
  - [x] 2.1 Implementar `StatusBar` em `src/features/demo/components/StatusBar.tsx`
    - Exportar `function StatusBar(): JSX.Element` sem props
    - Raiz `<div data-testid="status-bar" aria-hidden="true" className="flex h-6 items-center justify-between bg-surface-dark px-4 text-[11px] font-semibold text-text-on-dark">`
    - À esquerda: span com horário fixo `9:41`
    - À direita: `<SignalIcon />`, `<WifiIcon />`, `<BatteryIcon />` em `flex items-center gap-1` (12×12 via `className="w-3 h-3"`)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 2.2 Implementar `AppHeader` em `src/features/demo/components/AppHeader.tsx`
    - Exportar `function AppHeader(): JSX.Element` sem props
    - Raiz `<header data-testid="app-header" className="flex h-14 items-center justify-between border-b border-white/10 bg-surface-dark px-4 text-text-on-dark">`
    - À esquerda: avatar 40×40 (`aria-hidden="true"` sobre `bg-accent-primary rounded-full flex items-center justify-center` com letra `M` branca) + bloco de texto com `CASA 247 · BLOCO B` (`text-[10px] uppercase tracking-wider opacity-70`) em cima e `Olá, morador 👋` (`text-sm font-medium`) embaixo
    - À direita: container relativo com `<BellIcon className="w-6 h-6" />` + badge absolute (`absolute -top-1 -right-1 h-4 w-4 rounded-full bg-status-negative text-[10px] text-white flex items-center justify-center aria-hidden="true"`) exibindo `3`
    - Texto `CASA 247 · BLOCO B` preservado exatamente para compatibilidade com `DemoSection.test.tsx`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 2.3 Implementar `HighlightBanner` em `src/features/demo/components/HighlightBanner.tsx`
    - Exportar `function HighlightBanner(): JSX.Element` sem props
    - Raiz `<div data-testid="highlight-banner" className="mx-4 mt-2 flex h-14 items-center gap-2 rounded-md border border-accent-primary/30 bg-accent-primary/10 px-3 text-xs text-text-primary">`
    - Ícone `<InfoIcon className="w-4 h-4 shrink-0 text-accent-primary" />` (já `aria-hidden="true"` via `icons/InfoIcon.tsx`)
    - Texto: `Próxima reserva: Quadra hoje às 14:00`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 2.4 Implementar `BottomTabBar` em `src/features/demo/components/BottomTabBar.tsx`
    - Exportar `function BottomTabBar(): JSX.Element` sem props
    - Definir constante local `TABS` tipada `readonly { readonly id: 'home' | 'atividades' | 'avisos' | 'perfil'; readonly label: string; readonly ativo: boolean; readonly Icon: (props: { readonly className?: string }) => JSX.Element }[]` com 4 itens na ordem Home→Atividades→Avisos→Perfil e apenas `home` com `ativo: true`
    - Raiz `<nav data-testid="bottom-tab-bar" aria-hidden="true" className="grid h-14 grid-cols-4 border-t border-white/10 bg-surface-dark">`
    - Cada tab renderizada como `<div>` (não `<button>`, não `<a>`) contendo ícone + label, com `text-accent-primary` quando `ativo` e `text-text-tertiary` caso contrário; nenhum `onClick`, nenhum `tabindex`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 12.7_

- [x] 3. Refactor do MobileMockup para grid fixo + slots nomeados
  - [x] 3.1 Reescrever `src/features/demo/components/MobileMockup.tsx`
    - Substituir `interface MobileMockupProps { readonly children: ReactNode }` por `interface MobileMockupProps { readonly areaCards: ReactNode; readonly slotArea: ReactNode; readonly confirmButton: ReactNode; readonly confirmMessage: ReactNode }`
    - Raiz `<div data-testid="mobile-mockup" data-demo-frame className="mx-auto grid w-[320px] h-[640px] grid-rows-[24px_56px_56px_80px_208px_88px_56px] overflow-hidden rounded-[2rem] border-4 border-gray-900 bg-surface-dark shadow-2xl">`
    - Linha 1: `<StatusBar />`
    - Linha 2: `<AppHeader />`
    - Linha 3: `<HighlightBanner />`
    - Linha 4: `<div className="flex items-center bg-bg-secondary px-4">{areaCards}</div>`
    - Linha 5: `<div data-testid="slot-area" className="h-52 bg-bg-secondary px-4">{slotArea}</div>`
    - Linha 6: `<div className="grid grid-rows-[40px_8px_40px] bg-bg-secondary px-4">{confirmButton}<div aria-hidden="true" /><div data-testid="confirm-message-slot" className="relative h-10">{confirmMessage}</div></div>`
    - Linha 7: `<BottomTabBar />`
    - Remover `space-y-4` do conteúdo — os espaços agora são reservados pelo grid
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 1.9, 3.4, 4.6, 5.4, 9.1, 10.1, 10.6, 11.1_
  - [x] 3.2 Smoke test estrutural `MobileMockup.test.tsx`
    - Criar `src/features/demo/__tests__/MobileMockup.test.tsx`
    - Renderizar `<MobileMockup areaCards={<div />} slotArea={<div />} confirmButton={<button />} confirmMessage={null} />`
    - Assert: `data-testid="mobile-mockup"` + `data-demo-frame` presentes
    - Assert: `data-testid` `status-bar`, `app-header`, `highlight-banner`, `slot-area`, `confirm-message-slot`, `bottom-tab-bar` todos presentes
    - Assert: `9:41` e `CASA 247 · BLOCO B` e `Olá, morador 👋` visíveis
    - Assert: `BottomTabBar` expõe os 4 rótulos `Home`, `Atividades`, `Avisos`, `Perfil`
    - Assert: containers decorativos têm `aria-hidden="true"` no elemento raiz (via `element.getAttribute('aria-hidden')`)
    - _Requirements: 3.5, 4.4, 10.2, 10.7, 11.8_

- [x] 4. Refactor dos componentes de conteúdo do mockup
  - [x] 4.1 Refatorar `src/features/demo/components/AreaCard.tsx` (assinatura inalterada)
    - Manter `interface AreaCardProps { readonly area: AreaConfig; readonly selecionada: boolean; readonly onClick: () => void }`
    - Raiz `<button role="radio" aria-checked={selecionada} onClick={onClick} className="relative flex h-16 flex-col items-start justify-between rounded-md border ... transition-colors duration-150 ...">`
    - Incluir `<AreaIcon id={area.id} className="w-6 h-6 text-accent-primary" aria-hidden="true" />` no topo esquerdo
    - Nome da área em `text-xs font-semibold` abaixo do ícone
    - Borda `border-accent-primary border-2 bg-accent-primary/10` quando `selecionada`; `border-border-primary bg-bg-primary` caso contrário
    - Hover apenas quando `area.reservavel === true`: `hover:bg-bg-tertiary hover:border-border-secondary`
    - Quando `area.reservavel === false`: badge absolute no canto superior direito com texto `Informativa` em `bg-bg-tertiary text-text-tertiary text-[10px] rounded-sm px-1`
    - Preservar `focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.5_
  - [x] 4.2 Refatorar `src/features/demo/components/SlotGrid.tsx` (assinatura inalterada)
    - Manter `interface SlotGridProps { readonly slotsComStatus: readonly SlotComStatus[]; readonly slotSelecionado: Slot | null; readonly onSelect: (slot: Slot) => void }`
    - Detectar caminho Piscina via `slotsComStatus.length === 0`
    - Caminho Piscina: `<div role="note" className="flex h-52 flex-col items-center justify-center gap-2 text-center">` com `<AreaIcon id="piscina" className="w-12 h-12 text-accent-primary" />`, título `Piscina` (`text-sm font-semibold`) e explicação em duas linhas contendo a frase `informativa — não aceita reservas via app` (preserva matcher do `DemoSection.test.tsx`)
    - Caminho reservável: `<div role="group" aria-label="Grade de horários disponíveis" className="grid h-52 grid-cols-3 content-start gap-2 overflow-hidden py-2">` com cada slot `<button>` de `h-8` e classes por status:
      - `livre` não selecionado: `bg-bg-primary text-text-primary border-border-secondary`
      - `livre` selecionado: `bg-accent-primary text-text-on-dark border-accent-primary font-bold`
      - `ocupado`: `bg-bg-tertiary text-text-tertiary border-border-primary line-through cursor-not-allowed`
      - `fora-do-expediente`: `bg-bg-secondary text-text-tertiary border-border-primary` + `style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.04) 4px 8px)' }}`
    - Hover em livre não selecionado: `hover:bg-bg-tertiary transition-colors duration-150`
    - Preservar `aria-pressed` em slots livres, `aria-label="HH:MM — ocupado"` em ocupados, `aria-label="HH:MM — fora do horário"` + `title="Fora do horário"` em fora-do-expediente
    - _Requirements: 1.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 11.6_
  - [x] 4.3 Refatorar `src/features/demo/components/ConfirmButton.tsx` (assinatura inalterada)
    - Manter `interface ConfirmButtonProps { readonly podeConfirmar: boolean; readonly slotSelecionado: Slot | null; readonly fim: Slot | null; readonly onConfirm: () => void }`
    - Raiz `<button data-testid="confirm-button" type="button" disabled={!podeConfirmar} onClick={onConfirm} className="flex h-10 w-full items-center justify-center gap-2 rounded-md transition-transform duration-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ...">`
    - Habilitado: `bg-accent-primary text-text-on-dark font-bold` + `<CheckIcon className="w-4 h-4" />` + texto `Reservar HH:MM – HH:MM`
    - Desabilitado: `bg-bg-tertiary text-text-tertiary italic cursor-not-allowed` + texto `Selecione um horário` (sem ícone)
    - Nunca retornar `null`: mesmo desabilitado, renderiza o botão (garante altura fixa e presença de `[data-testid="confirm-button"]` em qualquer estado)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 11.2_
  - [x] 4.4 Refatorar `src/features/demo/components/ConfirmMessage.tsx` (assinatura inalterada)
    - Manter `interface ConfirmMessageProps { readonly ultimaConfirmacao: UltimaConfirmacao | null }`
    - Retornar `null` quando `ultimaConfirmacao === null` (o wrapper `h-10` no `MobileMockup` já reserva o espaço)
    - Quando não-null, retornar `<div role="status" aria-live="polite" className="flex h-10 items-center gap-2 rounded-md border border-accent-primary bg-accent-primary/10 px-2 text-xs text-accent-primary animate-[slide-in-up_240ms_ease-out]">` com `<CheckIcon className="w-4 h-4 shrink-0" />` + `<span>Reserva confirmada: {AREAS[area].nome} das {slot} às {fim}.</span>`
    - Preservar `role="status"` + `aria-live="polite"` (Req 9.4)
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 11.7_

- [x] 5. Refactor do container DemoMorador para os slots nomeados
  - [x] 5.1 Atualizar `src/features/demo/DemoMorador.tsx`
    - Trocar container raiz para `<div className="grid items-start gap-8 md:grid-cols-[320px_1fr] justify-items-center md:justify-items-start">`
    - Manter import e uso de `AREA_ORDER`, `AREAS`, `AreaCard`, `SlotGrid`, `ConfirmButton`, `ConfirmMessage`, `TimelineProximas`, `MobileMockup`, `DialogoFluxoMorador`
    - Substituir o JSX do `<MobileMockup>` antigo pelos 4 slots nomeados:
      - `areaCards={<div role="radiogroup" aria-label="Escolha uma área comum" className="grid w-full grid-cols-3 gap-2">{AREA_ORDER.map(...)}</div>}`
      - `slotArea={<SlotGrid ... />}`
      - `confirmButton={<ConfirmButton ... />}`
      - `confirmMessage={<ConfirmMessage ultimaConfirmacao={demo.state.ultimaConfirmacao} />}`
    - Preservar **byte-a-byte** todas as chamadas a `demo.dispatch` (`SELECT_AREA`, `SELECT_SLOT`, `CONFIRM`) e a construção das props
    - Preservar a coluna direita (título, parágrafo, mini-cards `2h`/`24/7`, `TimelineProximas`, botão "Ver fluxo completo" + `DialogoFluxoMorador`) sem mudanças estruturais
    - Envolver a coluna direita em `<div className="w-full max-w-md space-y-4">` para estabilidade dimensional (Req 2.3)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 11.1, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3_

- [x] 6. Checkpoint visual — Ensure all tests pass
  - Rodar `pnpm typecheck` e `pnpm test:run` (sem ainda os novos property tests); `DemoSection.test.tsx` pode falhar no teste da Piscina — será corrigido na Task 9
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Infraestrutura de testes (helpers compartilhados pelas properties)
  - [x] 7.1 Criar helper `makeFakeDemoHook`
    - Arquivo: `src/features/demo/__tests__/helpers/makeFakeDemoHook.ts`
    - Assinatura: `export function makeFakeDemoHook(state: DemoState): UseDemoReservasReturn`
    - Retorna `{ state, dispatch: () => {}, slotsComStatus: slotsComStatus(state, state.areaSelecionada), fimDaReservaSelecionada: fimDaReservaSelecionada(state), podeConfirmar: podeConfirmar(state) }`
    - Importa os helpers derivados de `../../derived` — não recria lógica
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6_
  - [x] 7.2 Criar arbitrários fast-check compartilhados
    - Arquivo: `src/features/demo/__tests__/helpers/demoArbitraries.ts`
    - Exportar `demoActionArb` como `fc.oneof(...)` cobrindo todas as 5 variantes de `DemoAction` (`SWITCH_VIEW`, `SELECT_AREA`, `SELECT_SLOT`, `CONFIRM`, `RESET`) usando `AREAS_ARR` e `allSlots = Array.from(new Set(AREAS_ARR.flatMap((id) => AREAS[id].slotsBase)))`
    - Exportar `actionSequenceArb = fc.array(demoActionArb, { minLength: 0, maxLength: 20 })`
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6_

- [x] 8. Testes novos de propriedades e acessibilidade
  - [x] 8.1 Property test P1 — Layout invariante do MobileMockup
    - Arquivo: `src/features/demo/__tests__/DemoMorador.layout.pbt.test.tsx`
    - Comentário-tag: `// Feature: demo-morador-mvp-polish, Property 1: Layout invariante do MobileMockup`
    - **Property 1: Layout invariante do MobileMockup**
    - Usar `test.prop([actionSequenceArb])(..., (actions) => { const finalState = actions.reduce(demoReducer, initialDemoState); const { container } = render(<DemoMorador demo={makeFakeDemoHook(finalState)} />); ... cleanup(); }, { numRuns: 100 })`
    - Asserts: `[data-demo-frame]` contém `w-[320px]`, `h-[640px]` e `grid-rows-[24px_56px_56px_80px_208px_88px_56px]`; `[data-testid="status-bar"]` contém `h-6`; `[data-testid="app-header"]`, `[data-testid="highlight-banner"]`, `[data-testid="bottom-tab-bar"]` contêm `h-14`; `[data-testid="slot-area"]` contém `h-52`; `[data-testid="confirm-message-slot"]` contém `h-10`; `[data-testid="confirm-button"]` contém `w-full` e `h-10`
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.4, 4.6, 5.4, 7.3, 8.1, 8.2, 9.1, 10.1, 10.6, 13.2, 13.3, 13.4, 13.6**
  - [x] 8.2 Property test P2 — AreaCards compartilham altura constante
    - Arquivo: `src/features/demo/__tests__/DemoMorador.layout.pbt.test.tsx` (segundo `test.prop` no mesmo arquivo do P1)
    - Comentário-tag: `// Feature: demo-morador-mvp-polish, Property 2: AreaCards compartilham altura constante`
    - **Property 2: AreaCards compartilham altura constante**
    - Asserts: `container.querySelectorAll('[role="radio"]')` tem `length === 3`; para cada card, `card.className` contém `h-16`
    - `numRuns: 100`
    - **Validates: Requirements 6.3, 6.4**
  - [x] 8.3 Property test P3 — Elementos decorativos fora do fluxo de foco
    - Arquivo: `src/features/demo/__tests__/DemoMorador.layout.pbt.test.tsx` (terceiro `test.prop` no mesmo arquivo)
    - Comentário-tag: `// Feature: demo-morador-mvp-polish, Property 3: Elementos decorativos fora do fluxo de foco`
    - **Property 3: Elementos decorativos fora do fluxo de foco**
    - Usar seletor `const FOCUSABLE = 'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'` e validar que `container.querySelector([data-testid="${testId}"]).querySelectorAll(FOCUSABLE).length === 0` para cada um dos 4 `testId`s decorativos
    - `numRuns: 100`
    - **Validates: Requirements 10.7, 10.8, 12.7**
  - [x] 8.4 Property test P4 — Texto da ConfirmMessage
    - Arquivo: `src/features/demo/__tests__/ConfirmMessage.pbt.test.tsx`
    - Comentário-tag: `// Feature: demo-morador-mvp-polish, Property 4: Texto da ConfirmMessage`
    - **Property 4: Texto da ConfirmMessage**
    - Construir `ultimaConfirmacaoArb` via `fc.constantFrom('quadra', 'deck')` encadeado com `fc.constantFrom(...slotsValidos)` filtrados por `addHoras(s, cfg.duracaoMaxHoras) <= closingToMinutes(cfg.fechamentoDiaUtil)` e mapeado para `{ area, slot, fim: fimComoSlot(addHoras(slot, cfg.duracaoMaxHoras)) }`
    - Renderizar `<ConfirmMessage ultimaConfirmacao={uc} />` isoladamente
    - Asserts: `screen.getByRole('status').textContent` contém `Reserva confirmada`, `AREAS[uc.area].nome`, `uc.slot`, `uc.fim`
    - `numRuns: 100`
    - **Validates: Requirements 9.5**
  - [x] 8.5 Teste de integração com axe-core
    - Arquivo: `src/features/demo/__tests__/axe.integration.test.tsx`
    - Usar `axe-core` (já instalado) diretamente: `import axe from 'axe-core'`
    - Renderizar `<DemoMorador demo={makeFakeDemoHook(initialDemoState)} />` e rodar `await axe.run(container, { runOnly: ['wcag2aa'] })`
    - Assert: `results.violations` deve ser `[]`
    - Cobre contraste de `StatusBar`, `AppHeader`, `HighlightBanner`, `AreaCard`, `SlotGrid`, `ConfirmButton`, `ConfirmMessage`, `BottomTabBar` numa única varredura
    - _Requirements: 3.6, 5.5, 7.7, 8.4, 10.9, 12.4_

- [x] 9. Ajustar testes existentes afetados pelo novo markup
  - [x] 9.1 Atualizar matcher do teste "selecionar Piscina" em `src/features/demo/__tests__/DemoSection.test.tsx`
    - Substituir `getByText(/informativa — não aceita reservas via app/i)` por `getByRole('note')` OU por um matcher resiliente `getByText(/informativa|não aceita reservas/i)` que cubra tanto a cópia antiga quanto a nova do bloco da Piscina
    - Verificar que os demais testes (`aria-selected` das tabs, fluxo 09:00 → confirmação, slot 10:00 ocupado, slot 21:00 fora do horário, preservação em `SWITCH_VIEW`) continuam passando sem alterações — se algum assert depender de markup removido, atualizar mantendo a cobertura do comportamento original
    - _Requirements: 11.8_

- [x] 10. Checkpoint final — preservação byte-a-byte e suíte verde
  - [x] 10.1 Verificar que os arquivos de lógica não foram alterados
    - Conferir via `git diff` que `src/features/demo/demoReducer.ts`, `src/features/demo/useDemoReservas.ts`, `src/features/demo/derived.ts`, `src/features/demo/types.ts` e `src/data/demoConfig.ts` estão byte-idênticos ao pré-feature
    - Se houver qualquer diff nesses arquivos, revert — a feature é UI-only
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  - [x] 10.2 Rodar suíte completa
    - `pnpm typecheck` sem erros
    - `pnpm lint` sem erros
    - `pnpm test:run` com todos os testes passando, incluindo `demoReducer.test.ts`, `demoReducer.pbt.test.ts`, `DemoSection.test.tsx` e (se implementados) P1–P4 + axe integration
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido; as properties P1–P4 são a rede de segurança contra regressões dimensionais e funcionais.
- Esta feature é **UI-only**: nenhum arquivo em `src/features/demo/` cujo nome não contenha `components/` ou `__tests__/` deve ser modificado, exceto `DemoMorador.tsx` (container visual) na Task 5.
- Cada property test referencia explicitamente uma Property do design e os acceptance criteria que ela valida, seguindo o padrão do spec pai `apresentacao-interativa-vendas`.
- Checkpoints (Tasks 6 e 10) são oportunidades para rodar a suíte de testes e alinhar com o usuário antes de seguir para o próximo bloco.

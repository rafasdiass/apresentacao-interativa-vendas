/**
 * src/features/demo/useDemoReservas.ts — Hook React para a Demo interativa.
 *
 * Este hook é a **única** integração React do núcleo puro da Demo. Ele
 * amarra três peças independentes:
 *
 * 1. O {@link demoReducer} puro (Task 5.2), consumido via
 *    {@link useReducer}.
 * 2. O {@link initialDemoState} (Task 5.1), combinado opcionalmente com
 *    um override parcial para permitir que testes e storybooks
 *    iniciem a Demo em um estado arbitrário.
 * 3. Os helpers derivados de {@link ./derived} (Task 5.3), memoizados
 *    por `state` via {@link useMemo} para evitar recomputar em
 *    re-renders disparados por ancestrais.
 *
 * A assinatura de retorno é deliberadamente estrita e `readonly`: o
 * consumidor principal (Task 7 — `DemoSection` e componentes filhos)
 * recebe as derivações já prontas, sem precisar conhecer o shape do
 * state, e dispara transições exclusivamente via `dispatch`.
 *
 * **Persistência (Req. 3.13)**
 * O estado vive apenas em memória (`useReducer`). Recarregar a página
 * reseta a Demo para {@link initialDemoState} sem código adicional —
 * não há `localStorage`, `sessionStorage` ou cookies envolvidos.
 *
 * Requirements: 3.13, 10.8
 */

import { useMemo, useReducer } from 'react';
import type { Dispatch } from 'react';
import { demoReducer } from './demoReducer';
import { fimDaReservaSelecionada, podeConfirmar, slotsComStatus } from './derived';
import { initialDemoState } from './types';
import type { DemoAction, DemoState, Slot, SlotComStatus } from './types';

/**
 * Forma do valor retornado por {@link useDemoReservas}.
 *
 * Todos os campos são `readonly` para sinalizar que a única via válida
 * de mutação é `dispatch`. Em particular, `slotsComStatus` é
 * `readonly SlotComStatus[]` — atribuições que tentem mutar a lista
 * são rejeitadas em tempo de compilação.
 */
export interface UseDemoReservasReturn {
  /** Estado atual da Demo, imutável. */
  readonly state: DemoState;
  /** Despachante do reducer; única via de transição de estado. */
  readonly dispatch: Dispatch<DemoAction>;
  /**
   * Par `(slot, status)` para cada slot base da `areaSelecionada`,
   * na ordem definida em `AREAS[area].slotsBase`.
   */
  readonly slotsComStatus: readonly SlotComStatus[];
  /**
   * Horário de término da reserva destacada, ou `null` se não há
   * `slotSelecionado` ou a área atual não é reservável.
   */
  readonly fimDaReservaSelecionada: Slot | null;
  /**
   * `true` quando o `ConfirmButton` deve estar habilitado para o
   * estado atual (mesmas guardas do `SELECT_SLOT`/`CONFIRM` do
   * reducer).
   */
  readonly podeConfirmar: boolean;
}

/**
 * Hook React que encapsula o reducer puro da Demo + derivações de UI.
 *
 * **Uso típico** (Task 7 — `DemoSection`):
 *
 * ```tsx
 * function DemoSection() {
 *   const demo = useDemoReservas();
 *   return (
 *     <>
 *       <DemoTabs view={demo.state.view} onSwitch={(view) => demo.dispatch({ type: 'SWITCH_VIEW', view })} />
 *       <SlotGrid
 *         slotsComStatus={demo.slotsComStatus}
 *         slotSelecionado={demo.state.slotSelecionado}
 *         onSelect={(slot) => demo.dispatch({ type: 'SELECT_SLOT', slot })}
 *       />
 *       <ConfirmButton
 *         podeConfirmar={demo.podeConfirmar}
 *         fim={demo.fimDaReservaSelecionada}
 *         onConfirm={() => demo.dispatch({ type: 'CONFIRM' })}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * **Override inicial** (`initial`): usado por testes e storybooks para
 * começar a Demo num estado arbitrário. Em produção, sempre chamar
 * sem argumentos — o seed de reservas da Quadra definido em
 * {@link initialDemoState} já reproduz o look-and-feel do HTML
 * original no primeiro render.
 *
 * Quando `initial` é `undefined` (caso comum), a mesclagem é
 * equivalente a `initialDemoState`. O `satisfies DemoState` garante
 * em tempo de compilação que o resultado da mescla continua sendo
 * um estado válido.
 */
export function useDemoReservas(
  initial?: Partial<DemoState>,
): UseDemoReservasReturn {
  const [state, dispatch] = useReducer(demoReducer, {
    ...initialDemoState,
    ...initial,
  } satisfies DemoState);

  // Memoiza derivações por `state`. O reducer retorna a mesma
  // referência em no-ops (ver `demoReducer.ts`), então esses `useMemo`
  // recicclam os arrays/valores anteriores sem alocar — o que ajuda a
  // manter `React.memo` em filhos (`SlotGrid`, `ConfirmButton`) estável.
  const statusSlots = useMemo(
    () => slotsComStatus(state, state.areaSelecionada),
    [state],
  );
  const fim = useMemo(() => fimDaReservaSelecionada(state), [state]);
  const podeConf = useMemo(() => podeConfirmar(state), [state]);

  return {
    state,
    dispatch,
    slotsComStatus: statusSlots,
    fimDaReservaSelecionada: fim,
    podeConfirmar: podeConf,
  };
}

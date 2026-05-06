/**
 * src/features/demo/__tests__/helpers/makeFakeDemoHook.ts
 *
 * Helper de teste que constrói um `UseDemoReservasReturn` determinístico a
 * partir de um {@link DemoState} fornecido — sem envolver React nem
 * `useReducer`. Os property tests desta feature (P1–P3 em
 * `DemoMorador.layout.pbt.test.tsx`) geram centenas de estados via
 * `actions.reduce(demoReducer, initialDemoState)` e precisam renderizar
 * `<DemoMorador demo={...} />` **sem** simular a árvore de efeitos
 * reais; por isso `dispatch` aqui é um `noop` e as derivações são
 * computadas por chamada direta aos helpers puros de `../../derived`.
 *
 * Importante: este helper **não recria lógica**. Ele consome
 * exclusivamente `slotsComStatus`, `fimDaReservaSelecionada` e
 * `podeConfirmar` do módulo `derived`, garantindo que qualquer
 * comportamento validado no núcleo puro é o mesmo visto pela UI nos
 * testes de propriedade — sem divergência possível entre o cálculo
 * "de produção" e o "de teste".
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.6
 */

import {
  fimDaReservaSelecionada,
  podeConfirmar,
  slotsComStatus,
} from '../../derived';
import type { DemoState } from '../../types';
import type { UseDemoReservasReturn } from '../../useDemoReservas';

/**
 * Constrói um {@link UseDemoReservasReturn} a partir de um
 * {@link DemoState} arbitrário.
 *
 * - `state`: repassado tal qual recebido.
 * - `dispatch`: `noop` — os property tests apenas renderizam estados
 *   pré-computados e nunca dependem de transições "ao vivo".
 * - `slotsComStatus`, `fimDaReservaSelecionada`, `podeConfirmar`:
 *   calculados pelos helpers puros de `../../derived` aplicados ao
 *   `state` recebido.
 *
 * O cálculo acontece na criação do retorno (não memoizado), o que é
 * suficiente para o uso em testes: cada invocação produz um objeto
 * novo com os campos já resolvidos, e o consumidor é `<DemoMorador>`
 * renderizado uma única vez por execução do property.
 */
export function makeFakeDemoHook(state: DemoState): UseDemoReservasReturn {
  return {
    state,
    dispatch: () => {},
    slotsComStatus: slotsComStatus(state, state.areaSelecionada),
    fimDaReservaSelecionada: fimDaReservaSelecionada(state),
    podeConfirmar: podeConfirmar(state),
  };
}

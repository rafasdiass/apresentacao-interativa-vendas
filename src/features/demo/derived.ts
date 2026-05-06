/**
 * src/features/demo/derived.ts — Helpers derivados puros da Demo interativa.
 *
 * Este módulo complementa o {@link demoReducer} fornecendo **seletores
 * derivados** sobre o {@link DemoState}: funções puras que computam
 * valores visíveis na UI a partir do estado imutável + da configuração
 * estática em {@link AREAS}, sem nunca mutar entrada.
 *
 * As três funções aqui exportadas são consumidas pelo hook
 * `useDemoReservas` (Task 5.4) e, indiretamente, pelos componentes
 * `SlotGrid`, `ConfirmButton` e `ConfirmMessage` (Tasks 7.2 e 7.3).
 * Como são puras e sem dependência de React, também servem de alvo
 * para testes exemplares e de propriedade.
 *
 * Propriedades validadas nas Tasks 5.6–5.11 que dependem deste módulo:
 *
 * - Property 4 (particionamento): os três status possíveis de
 *   {@link slotsComStatus} formam uma partição de `AREAS[area].slotsBase`.
 * - Property 5 (respeito ao fechamento): todo slot cujo fim ultrapassa
 *   `fechamentoDiaUtil` recebe status `'fora-do-expediente'`.
 * - Property 8 (Piscina não reservável): áreas com `reservavel: false`
 *   têm `slotsBase === []`, e {@link fimDaReservaSelecionada} / {@link podeConfirmar}
 *   retornam valores seguros mesmo se o estado for manipulado externamente.
 *
 * Todas as funções usam exclusivamente `fechamentoDiaUtil` para o MVP,
 * em paralelo com a escolha feita pelo `demoReducer`. Uma versão
 * futura pode ler o dia da semana atual e alternar para
 * `fechamentoFimDeSemana`.
 *
 * Requirements: 3.5, 3.8, 12.3, 12.6
 */

import { AREAS } from '@/data/demoConfig';
import type { AreaId, DemoState, Slot, SlotComStatus } from './types';
import { addHoras, closingToMinutes, fimComoSlot } from './demoReducer';

// ────────────────────────────────────────────────────────────────────────────
// slotsComStatus
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calcula o status visual de cada slot base da área informada, para
 * renderização no `SlotGrid` (Task 7.2).
 *
 * Para cada `slot ∈ AREAS[area].slotsBase`, o status é determinado na
 * seguinte ordem (primeiro que casar ganha):
 *
 * 1. Se `AREAS[area].reservavel === false`: **todos** os slots são
 *    `'fora-do-expediente'`. Na prática, áreas não reserváveis (Piscina)
 *    têm `slotsBase === []`, de modo que a lista devolvida é vazia —
 *    esta cláusula existe como defesa caso a configuração mude.
 * 2. Se o slot está em `state.reservasPorArea[area]`: `'ocupado'`.
 * 3. Se `slot + duracaoMaxHoras > fechamentoDiaUtil`:
 *    `'fora-do-expediente'`. Este é o mesmo predicado usado pelo
 *    `demoReducer` em `SELECT_SLOT` (Property 5), corrigindo o Bug #6
 *    do HTML original (`21:00 + 2h = 23:00 > 22:00`).
 * 4. Caso contrário: `'livre'`.
 *
 * O retorno é um `readonly SlotComStatus[]` preservando a ordem de
 * `AREAS[area].slotsBase`. Os três status possíveis são disjuntos e sua
 * união é exatamente `slotsBase` — o que sustenta a Property 4
 * (particionamento).
 */
export function slotsComStatus(
  state: DemoState,
  area: AreaId,
): readonly SlotComStatus[] {
  const config = AREAS[area];

  // Áreas não reserváveis: toda a grade fica fora do expediente.
  // Na configuração vigente, `slotsBase` é vazio para essas áreas —
  // então `.map` devolve `[]` — mas preservar a regra explicitamente
  // protege contra mudanças futuras em `demoConfig.ts`.
  if (!config.reservavel) {
    return config.slotsBase.map((slot) => ({
      slot,
      status: 'fora-do-expediente',
    }));
  }

  const reservas = state.reservasPorArea[area];
  const fechamentoMin = closingToMinutes(config.fechamentoDiaUtil);

  return config.slotsBase.map((slot) => {
    if (reservas.includes(slot)) {
      return { slot, status: 'ocupado' };
    }
    if (addHoras(slot, config.duracaoMaxHoras) > fechamentoMin) {
      return { slot, status: 'fora-do-expediente' };
    }
    return { slot, status: 'livre' };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// fimDaReservaSelecionada
// ────────────────────────────────────────────────────────────────────────────

/**
 * Calcula o horário de término da reserva atualmente destacada, usado
 * pelo `ConfirmButton` para renderizar o texto
 * `"Reservar HH:MM – HH:MM"` (Task 7.3).
 *
 * Retorna `null` quando não há reserva a exibir:
 *
 * - Se `state.slotSelecionado === null`.
 * - Se a área selecionada não for reservável — defesa contra estado
 *   inconsistente (o `demoReducer` impede selecionar slot em Piscina,
 *   mas um state externo manipulado poderia burlar essa garantia).
 *
 * Caso contrário, soma `AREAS[area].duracaoMaxHoras` ao
 * `slotSelecionado` via {@link addHoras} e formata o resultado como
 * {@link Slot} via {@link fimComoSlot} — que trata corretamente o
 * sentinel `'00:00'` (meia-noite no fim do dia).
 */
export function fimDaReservaSelecionada(state: DemoState): Slot | null {
  if (state.slotSelecionado === null) return null;

  const area = state.areaSelecionada;
  const config = AREAS[area];

  // Defesa: se alguém construiu um state com slot selecionado em área
  // não-reservável, não arriscamos devolver um fim baseado em
  // `duracaoMaxHoras === 0` (que produziria `slot` idêntico ao início).
  if (!config.reservavel) return null;

  const fimMin = addHoras(state.slotSelecionado, config.duracaoMaxHoras);
  return fimComoSlot(fimMin);
}

// ────────────────────────────────────────────────────────────────────────────
// podeConfirmar
// ────────────────────────────────────────────────────────────────────────────

/**
 * Indica se o `ConfirmButton` deve estar ativo para o estado atual.
 *
 * Retorna `true` sse **todas** as condições abaixo são satisfeitas:
 *
 * 1. `state.slotSelecionado !== null` — há um slot destacado.
 * 2. `AREAS[state.areaSelecionada].reservavel === true` — a área aceita
 *    reservas (defesa contra Piscina, Property 8).
 * 3. O slot não está em `state.reservasPorArea[area]` — a área ainda
 *    não tem esse horário reservado (Property 3).
 * 4. `slot + duracaoMaxHoras ≤ fechamentoDiaUtil` — respeita o fim do
 *    expediente (Property 5, corrige Bug #6 do HTML original).
 *
 * Essas verificações espelham exatamente as guardas de `SELECT_SLOT` e
 * `CONFIRM` no `demoReducer`. Sua existência aqui permite que a UI
 * habilite/desabilite o CTA de confirmação **antes** de `dispatch`,
 * sem precisar inspecionar efeitos colaterais do reducer.
 */
export function podeConfirmar(state: DemoState): boolean {
  const slot = state.slotSelecionado;
  if (slot === null) return false;

  const area = state.areaSelecionada;
  const config = AREAS[area];

  if (!config.reservavel) return false;

  if (state.reservasPorArea[area].includes(slot)) return false;

  const fimMin = addHoras(slot, config.duracaoMaxHoras);
  if (fimMin > closingToMinutes(config.fechamentoDiaUtil)) return false;

  return true;
}

/**
 * src/features/demo/demoReducer.ts — Redutor puro da Demo interativa.
 *
 * Este módulo isola TODA a lógica de transição de estado da Demo em uma
 * função pura `demoReducer`, sem dependência de React, DOM ou data/hora
 * real. O objetivo é permitir:
 *
 * 1. Testes exemplares simples (Task 5.5).
 * 2. Testes de propriedade via fast-check validando as Properties 3–8
 *    (Tasks 5.6–5.11) — propriedades universais sobre sequências
 *    aleatórias de ações.
 *
 * Regras-chave implementadas aqui (com referência direta às Properties):
 *
 * - Property 3 / Req. 12.7: `CONFIRM` é idempotente — reservar o mesmo
 *   slot duas vezes não duplica entradas em `reservasPorArea`.
 * - Property 5 / Req. 3.8: slots cujo fim (`slot + duracaoMaxHoras`)
 *   ultrapassa o fechamento do dia útil são rejeitados
 *   (bug #6 do HTML original: `21:00 + 2h = 23:00 > 22:00`).
 * - Property 6 / Req. 3.9: operar uma área nunca altera
 *   `reservasPorArea` de outra área (o reducer só toca a entrada
 *   correspondente a `state.areaSelecionada`).
 * - Property 7 / Req. 3.2, 12.9: `SWITCH_VIEW` preserva
 *   `areaSelecionada`, `slotSelecionado` e `reservasPorArea`.
 * - Property 8 / Req. 3.10: Piscina (`reservavel: false`) nunca recebe
 *   reservas, independentemente da sequência de ações.
 *
 * **Pureza** (requisito para PBT):
 * - Sem `Date`, sem `Math.random`, sem I/O, sem dependência de tempo.
 * - Para os mesmos `(state, action)`, a saída é determinística.
 * - O estado nunca é mutado — todas as transições retornam um novo
 *   objeto quando algum campo muda.
 *
 * Para o MVP o reducer usa exclusivamente o fechamento de dia útil
 * (`fechamentoDiaUtil`). A alternância dia-útil / fim-de-semana é
 * responsabilidade da Task 5.3 (`derived.ts`) ou de uma versão futura
 * que leia o dia da semana atual.
 *
 * Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 11.5, 12.2, 12.6,
 * 12.7, 12.9
 */

import { AREAS } from '@/data/demoConfig';
import type { DemoAction, DemoState, Slot } from './types';
import { initialDemoState } from './types';

// ────────────────────────────────────────────────────────────────────────────
// Helpers temporais (puros, sem `Date`)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Converte um {@link Slot} no formato `HH:MM` para o total de minutos
 * decorridos desde a meia-noite (`'00:00' → 0`, `'22:00' → 1320`).
 *
 * Observação importante: aqui `'00:00'` sempre retorna `0` — meia-noite
 * **no início** do dia. Quando `'00:00'` aparece como horário de
 * **fechamento** (ex.: `AREAS.quadra.fechamentoFimDeSemana`), ele
 * significa "meia-noite no fim do dia" e deve ser convertido com
 * {@link closingToMinutes}, que devolve `1440`.
 */
export function slotToMinutes(slot: Slot): number {
  // `slot` é garantido ser `HH:MM` pelo template literal type, então
  // usar `slice` (ao invés de `split` + indexação) evita qualquer
  // interação com `noUncheckedIndexedAccess`.
  const h = Number(slot.slice(0, 2));
  const m = Number(slot.slice(3, 5));
  return h * 60 + m;
}

/**
 * Converte um horário de **fechamento** para minutos desde a meia-noite,
 * tratando o sentinel `'00:00'` como `1440` (24 × 60 = meia-noite **no
 * fim do dia**).
 *
 * Isso é crítico para a Quadra e o Deck, cujo
 * `fechamentoFimDeSemana === '00:00'` significa "aberto até meia-noite".
 * Se tratássemos esse sentinel como `0`, qualquer validação de fim de
 * expediente (`fim <= fechamento`) ficaria invertida e o reducer
 * rejeitaria todos os slots.
 */
export function closingToMinutes(fechamento: Slot): number {
  if (fechamento === '00:00') return 24 * 60;
  return slotToMinutes(fechamento);
}

/**
 * Retorna o horário de término (em minutos desde a meia-noite) para uma
 * reserva iniciada em `slot` com duração `horas`.
 *
 * Equivalente a `slotToMinutes(slot) + horas * 60`; extraído em helper
 * para dar nome à operação nas chamadas do reducer, onde o que importa
 * é o conceito "fim da reserva".
 */
export function addHoras(slot: Slot, horas: number): number {
  return slotToMinutes(slot) + horas * 60;
}

/**
 * Converte um valor em minutos (no intervalo `0..1440`) de volta para
 * um {@link Slot} no formato `HH:MM`.
 *
 * Caso especial: quando `minutos === 1440`, retorna `'00:00'` —
 * meia-noite no fim do dia, consistente com {@link closingToMinutes}.
 * Para qualquer outro valor, calcula horas/minutos e formata com dois
 * dígitos em cada campo.
 *
 * A função pressupõe entrada válida (`0 ≤ minutos ≤ 1440`), pois no
 * reducer o valor sempre vem de `addHoras` sobre um slot já validado
 * por `SELECT_SLOT` (que garante `fim ≤ fechamento ≤ 1440`).
 */
export function fimComoSlot(minutos: number): Slot {
  if (minutos === 24 * 60) return '00:00';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  // O `as Slot` é necessário porque TS não consegue provar que
  // `${string}:${string}` satisfaz o template literal de dois dígitos.
  return `${hh}:${mm}` as Slot;
}

// ────────────────────────────────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────────────────────────────────

/**
 * Redutor puro da Demo interativa.
 *
 * Nunca muta `state`. Sempre retorna um novo objeto quando algum campo
 * muda; retorna o próprio `state` (referência idêntica) para ações que
 * são no-op — isso permite detecção barata de "houve mudança?" via
 * comparação `===` em `useMemo`/`useEffect`.
 *
 * Contratos por ação:
 *
 * - **`SWITCH_VIEW`** — troca apenas `state.view`. Preserva
 *   `areaSelecionada`, `slotSelecionado` e `reservasPorArea`
 *   (Property 7, Req. 3.2, 12.9).
 *
 * - **`SELECT_AREA`** — troca `areaSelecionada` e reseta
 *   `slotSelecionado` para `null`, impedindo que o destaque de um slot
 *   da área anterior "vaze" visualmente para a nova grade.
 *
 * - **`SELECT_SLOT`** — tenta destacar `action.slot` como seleção atual,
 *   aplicando em ordem as seguintes validações defensivas (qualquer
 *   uma que falhe resulta em no-op):
 *     1. A área atual é reservável (`reservavel === true`) — caso
 *        contrário (Piscina) é no-op (Property 8, Req. 3.10).
 *     2. O slot pertence a `AREAS[area].slotsBase` — defesa contra
 *        entradas inválidas.
 *     3. O slot **não** está em `reservasPorArea[area]` —
 *        (Property 3 / Req. 3.7: não se seleciona slot ocupado).
 *     4. `slot + duracaoMaxHoras * 60min ≤ fechamentoDiaUtil`
 *        (Property 5 / Req. 3.8: bug #6 do HTML original).
 *
 * - **`CONFIRM`** — registra uma reserva em `reservasPorArea[area]`
 *   para o slot atualmente selecionado. É no-op se:
 *     - Não há slot selecionado (`slotSelecionado === null`);
 *     - A área não é reservável (defesa contra Piscina, Property 8);
 *     - O slot já está reservado (idempotência, Property 3 / Req. 12.7).
 *   Na confirmação bem-sucedida também reseta `slotSelecionado: null` e
 *   popula `ultimaConfirmacao` com `{ area, slot, fim }`.
 *
 * - **`RESET`** — volta ao {@link initialDemoState} (mesma referência
 *   canônica, o que torna `state === initialDemoState` um teste barato
 *   para "demo foi resetada?").
 *
 * A cláusula `default` usa o padrão `never` para exaustividade em tempo
 * de compilação: qualquer nova variante adicionada a `DemoAction` sem
 * tratamento aqui causa erro imediato do TypeScript.
 */
export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SWITCH_VIEW': {
      // Property 7 — preserva todos os demais campos; toque só em `view`.
      return { ...state, view: action.view };
    }

    case 'SELECT_AREA': {
      return {
        ...state,
        areaSelecionada: action.area,
        slotSelecionado: null,
      };
    }

    case 'SELECT_SLOT': {
      const area = state.areaSelecionada;
      const config = AREAS[area];

      // 1. Property 8 — Piscina (ou qualquer área com `reservavel: false`)
      //    nunca permite seleção de slot.
      if (!config.reservavel) return state;

      // 2. Defesa — só aceitamos slots previstos na grade base da área.
      if (!config.slotsBase.includes(action.slot)) return state;

      // 3. Property 3 — não se seleciona slot já ocupado.
      const reservasAtuais = state.reservasPorArea[area];
      if (reservasAtuais.includes(action.slot)) return state;

      // 4. Property 5 — rejeita slots cujo fim ultrapassaria o
      //    fechamento do dia útil (ex.: `21:00 + 2h = 23:00 > 22:00`).
      const fimMin = addHoras(action.slot, config.duracaoMaxHoras);
      if (fimMin > closingToMinutes(config.fechamentoDiaUtil)) return state;

      return { ...state, slotSelecionado: action.slot };
    }

    case 'CONFIRM': {
      const { slotSelecionado, areaSelecionada } = state;

      // Sem slot selecionado → nada a confirmar.
      if (slotSelecionado === null) return state;

      const config = AREAS[areaSelecionada];

      // Property 8 — defesa contra área não-reservável. Em regime normal
      // `slotSelecionado` já seria `null` aqui (porque `SELECT_SLOT` é
      // no-op para Piscina), mas a guarda explícita protege contra
      // manipulação direta do state externo.
      if (!config.reservavel) return state;

      const reservasAtuais = state.reservasPorArea[areaSelecionada];

      // Idempotência (Property 3 / Req. 12.7): se o slot já está
      // reservado, não duplica — e também não muta nenhum outro campo.
      if (reservasAtuais.includes(slotSelecionado)) return state;

      // SELECT_SLOT já garantiu que `fimMin ≤ fechamento ≤ 1440`.
      const fimMin = addHoras(slotSelecionado, config.duracaoMaxHoras);
      const fim = fimComoSlot(fimMin);

      return {
        ...state,
        reservasPorArea: {
          ...state.reservasPorArea,
          [areaSelecionada]: [...reservasAtuais, slotSelecionado],
        },
        slotSelecionado: null,
        ultimaConfirmacao: {
          area: areaSelecionada,
          slot: slotSelecionado,
          fim,
        },
      };
    }

    case 'RESET':
      return initialDemoState;

    default: {
      // Exaustividade: qualquer variante nova de `DemoAction` sem caso
      // acima gera erro de tipo aqui.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

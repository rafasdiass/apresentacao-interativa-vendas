// Feature: apresentacao-interativa-vendas
// Property-based tests for the demoReducer (pure core of the Demo).
// Covers Properties 3–8 defined in design.md "Correctness Properties".
// Validates: Requirements 3.2, 3.7, 3.8, 3.9, 3.10, 11.5, 12.2, 12.3, 12.6, 12.7, 12.9

import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { demoReducer } from '../demoReducer';
import { slotsComStatus } from '../derived';
import { initialDemoState, AREAS_ARR } from '../types';
import type { AreaId, DemoAction, DemoState, Slot } from '../types';
import { AREAS } from '@/data/demoConfig';

// ────────────────────────────────────────────────────────────────────────────
// Arbitraries comuns a todas as propriedades
// ────────────────────────────────────────────────────────────────────────────

/**
 * União de todos os slots que qualquer área possa referenciar. Usamos
 * essa união para manter as arbitraries simples — o reducer tem guardas
 * (`slotsBase.includes`, `reservavel`) que rejeitam slots fora da grade
 * da área ativa, então enviar um slot "errado" é apenas um no-op
 * determinístico, não uma falha do teste.
 */
const ALL_SLOTS: readonly Slot[] = Array.from(
  new Set<Slot>([
    ...AREAS.quadra.slotsBase,
    ...AREAS.deck.slotsBase,
    ...AREAS.piscina.slotsBase,
  ]),
);

const areaIdArb = fc.constantFrom<AreaId>(...AREAS_ARR);
const slotArb = fc.constantFrom<Slot>(...ALL_SLOTS);

/**
 * Arbitrary que amostra uniformemente uma `DemoAction` de qualquer uma
 * das cinco variantes. A propriedade `type` usa `fc.constant(... as const)`
 * para preservar o literal string no tipo inferido.
 */
const actionArb: fc.Arbitrary<DemoAction> = fc.oneof(
  fc.record({
    type: fc.constant('SWITCH_VIEW' as const),
    view: fc.constantFrom<'morador' | 'sindico'>('morador', 'sindico'),
  }),
  fc.record({
    type: fc.constant('SELECT_AREA' as const),
    area: areaIdArb,
  }),
  fc.record({
    type: fc.constant('SELECT_SLOT' as const),
    slot: slotArb,
  }),
  fc.record({ type: fc.constant('CONFIRM' as const) }),
  fc.record({ type: fc.constant('RESET' as const) }),
);

const actionSequenceArb = fc.array(actionArb, { minLength: 0, maxLength: 50 });

/**
 * Aplica uma sequência de ações sobre `state`, equivalente a
 * `actions.reduce(demoReducer, state)` — mas nomeado para legibilidade
 * nos corpos dos testes.
 */
function runAll(state: DemoState, actions: readonly DemoAction[]): DemoState {
  return actions.reduce(demoReducer, state);
}

/**
 * Converte um {@link Slot} (`HH:MM`) para o total de minutos desde a
 * meia-noite. Pressupõe formato válido, garantido pelo template literal
 * type de `Slot`.
 */
function slotMinutes(slot: Slot): number {
  const h = Number(slot.slice(0, 2));
  const m = Number(slot.slice(3, 5));
  return h * 60 + m;
}

/**
 * Minutos desde a meia-noite para o horário de fechamento em dia útil
 * da área dada, tratando o sentinel `'00:00'` como `1440` ("meia-noite
 * no fim do dia") — consistente com o mesmo sentinel usado no
 * `demoReducer` / `closingToMinutes`.
 */
function closingMinutesOf(area: AreaId): number {
  const fech = AREAS[area].fechamentoDiaUtil;
  if (fech === '00:00') return 24 * 60;
  return slotMinutes(fech);
}

// ────────────────────────────────────────────────────────────────────────────
// Property 3 — Não-duplicidade de reserva
// *For all* sequências de ações, nenhum slot aparece mais de uma vez em
// reservasPorArea[area].
// Validates: Requirements 3.7, 11.5, 12.2, 12.7
// ────────────────────────────────────────────────────────────────────────────

describe('Property 3 — Não-duplicidade de reserva', () => {
  test.prop([actionSequenceArb], { numRuns: 200 })(
    'nenhum slot é reservado mais de uma vez em qualquer área',
    (actions) => {
      const final = runAll(initialDemoState, actions);
      for (const area of AREAS_ARR) {
        const reservas = final.reservasPorArea[area];
        expect(new Set(reservas).size).toBe(reservas.length);
      }
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Property 4 — Particionamento dos slots por área
// *For all* estados, slotsLivres ∪ slotsOcupados ∪ slotsForaDoExpediente
// === slotsBase, dois-a-dois disjuntos.
// Validates: Requirements 12.3
// ────────────────────────────────────────────────────────────────────────────

describe('Property 4 — Particionamento dos slots', () => {
  test.prop([actionSequenceArb], { numRuns: 200 })(
    'slotsComStatus particiona slotsBase em livre/ocupado/fora-do-expediente',
    (actions) => {
      const final = runAll(initialDemoState, actions);
      for (const area of AREAS_ARR) {
        const slotsBase = AREAS[area].slotsBase;
        const comStatus = slotsComStatus(final, area);

        // Cada slot de slotsBase aparece exatamente uma vez em comStatus,
        // na mesma ordem — isso sozinho prova que a união é slotsBase.
        expect(comStatus.map((s) => s.slot)).toEqual([...slotsBase]);

        // Cada slot recebe UM único status (conjuntos dois-a-dois disjuntos).
        const statuses = new Map<Slot, string>();
        for (const s of comStatus) {
          expect(statuses.has(s.slot)).toBe(false);
          statuses.set(s.slot, s.status);
        }
        expect(statuses.size).toBe(slotsBase.length);
      }
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Property 5 — Respeito ao horário de fechamento
// *For all* sequências, nenhum slot em final.reservasPorArea[area]
// satisfaz slot + duracaoMax > fechamentoDiaUtil.
// Validates: Requirements 3.8, 11.5, 12.6
// ────────────────────────────────────────────────────────────────────────────

describe('Property 5 — Respeito ao horário de fechamento', () => {
  test.prop([actionSequenceArb], { numRuns: 200 })(
    'nenhuma reserva confirmada ultrapassa o horário de fechamento',
    (actions) => {
      const final = runAll(initialDemoState, actions);
      for (const area of AREAS_ARR) {
        const config = AREAS[area];
        if (!config.reservavel) continue;

        const fechamentoMin = closingMinutesOf(area);
        for (const slot of final.reservasPorArea[area]) {
          const fimMin = slotMinutes(slot) + config.duracaoMaxHoras * 60;
          expect(fimMin).toBeLessThanOrEqual(fechamentoMin);
        }
      }
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Property 6 — Isolamento de estado por área
// *For all* sequências aplicadas com area fixa, reservasPorArea[outraArea]
// permanece inalterado.
// Validates: Requirements 3.9, 11.5
// ────────────────────────────────────────────────────────────────────────────

describe('Property 6 — Isolamento de estado por área', () => {
  /**
   * Arbitrary restrita a SELECT_SLOT e CONFIRM: nenhuma dessas ações
   * troca `areaSelecionada`, então a premissa "area fixa" é preservada
   * ao longo de toda a sequência. Isso exclui SELECT_AREA, SWITCH_VIEW
   * e RESET do espaço de busca desta property (por construção).
   */
  const acoesDaAreaArb = fc.array(
    fc.oneof(
      fc.record({
        type: fc.constant('SELECT_SLOT' as const),
        slot: slotArb,
      }),
      fc.record({ type: fc.constant('CONFIRM' as const) }),
    ),
    { minLength: 0, maxLength: 40 },
  );

  test.prop([areaIdArb, acoesDaAreaArb], { numRuns: 150 })(
    'operações em uma área não alteram reservasPorArea de outras áreas',
    (areaFixa, acoesOpcionais) => {
      const seed: readonly DemoAction[] = [
        { type: 'SELECT_AREA', area: areaFixa },
      ];
      const final = runAll(initialDemoState, [...seed, ...acoesOpcionais]);

      for (const area of AREAS_ARR) {
        if (area === areaFixa) continue;
        // Igualdade referencial: o reducer só toca em
        // `reservasPorArea[areaSelecionada]`, então outras entradas
        // devem preservar a referência original de `initialDemoState`.
        expect(final.reservasPorArea[area]).toBe(
          initialDemoState.reservasPorArea[area],
        );
      }
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Property 7 — Preservação de estado ao alternar aba Morador ↔ Síndico
// *For all* state, depois de SWITCH_VIEW('sindico'); SWITCH_VIEW('morador'),
// os campos areaSelecionada, slotSelecionado e reservasPorArea são
// idênticos ao original.
// Validates: Requirements 12.9, 3.2
// ────────────────────────────────────────────────────────────────────────────

describe('Property 7 — Preservação ao alternar aba', () => {
  test.prop([actionSequenceArb], { numRuns: 100 })(
    'duas trocas de aba consecutivas preservam áreas, slot e reservas',
    (actions) => {
      const base = runAll(initialDemoState, actions);
      const aposToggle = runAll(base, [
        { type: 'SWITCH_VIEW', view: 'sindico' },
        { type: 'SWITCH_VIEW', view: 'morador' },
      ]);

      expect(aposToggle.areaSelecionada).toBe(base.areaSelecionada);
      expect(aposToggle.slotSelecionado).toBe(base.slotSelecionado);
      expect(aposToggle.reservasPorArea).toEqual(base.reservasPorArea);
      // A view final é a última alternada; garante que o SWITCH_VIEW
      // realmente ocorreu e não foi otimizado para no-op prematuramente.
      expect(aposToggle.view).toBe('morador');
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Property 8 — Piscina não é reservável
// *For all* sequências com area=piscina (forçada no início),
// reservasPorArea.piscina === [] e ultimaConfirmacao?.area !== 'piscina'.
// Validates: Requirements 3.10, 11.5
// ────────────────────────────────────────────────────────────────────────────

describe('Property 8 — Piscina não é reservável', () => {
  test.prop([fc.array(actionArb, { minLength: 0, maxLength: 40 })], {
    numRuns: 150,
  })(
    'Piscina nunca acumula reservas, independentemente da sequência',
    (actions) => {
      // Força a Piscina como área inicial; ações seguintes podem trocar
      // para outra área e voltar, mas a propriedade SOBRE PISCINA é
      // absoluta — `reservasPorArea.piscina` só cresceria via CONFIRM
      // com `areaSelecionada === 'piscina'`, que o reducer bloqueia via
      // guarda `reservavel === false`.
      const final = runAll(initialDemoState, [
        { type: 'SELECT_AREA', area: 'piscina' },
        ...actions,
      ]);

      expect(final.reservasPorArea.piscina).toHaveLength(0);
      if (final.ultimaConfirmacao !== null) {
        expect(final.ultimaConfirmacao.area).not.toBe('piscina');
      }
    },
  );
});

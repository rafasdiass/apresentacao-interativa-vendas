/**
 * src/features/demo/__tests__/demoReducer.test.ts — Unit tests exemplares
 * do redutor puro da Demo interativa (Task 5.5).
 *
 * Cada `describe` agrupa os casos felizes e os no-ops de uma action do
 * `demoReducer`, ancorados em exemplos concretos. Os testes de
 * propriedade (Properties 3–8) cobrem o mesmo reducer sob sequências
 * aleatórias em `demoReducer.pbt.test.ts` (Tasks 5.6–5.11).
 *
 * Validates: Requirements 3.4, 3.5, 3.6, 3.10
 */

import { describe, expect, it } from 'vitest';
import { demoReducer } from '../demoReducer';
import { initialDemoState } from '../types';
import type { DemoAction, DemoState } from '../types';

/**
 * Reduz uma sequência de ações sobre `state`, retornando o estado
 * final. Açúcar sintático para tornar as cadeias
 * `SELECT_AREA → SELECT_SLOT → CONFIRM` legíveis num único `expect(...)`.
 */
function apply(state: DemoState, ...actions: DemoAction[]): DemoState {
  return actions.reduce(demoReducer, state);
}

// ────────────────────────────────────────────────────────────────────────────
// initialDemoState — seed canônico da Demo
// ────────────────────────────────────────────────────────────────────────────

describe('initialDemoState', () => {
  it('seed de reservas da Quadra é ["10:00", "14:00", "15:00", "20:00"]', () => {
    expect(initialDemoState.reservasPorArea.quadra).toEqual([
      '10:00',
      '14:00',
      '15:00',
      '20:00',
    ]);
  });

  it('Deck e Piscina começam vazios', () => {
    expect(initialDemoState.reservasPorArea.deck).toEqual([]);
    expect(initialDemoState.reservasPorArea.piscina).toEqual([]);
  });

  it('view começa em "morador" e areaSelecionada em "quadra"', () => {
    expect(initialDemoState.view).toBe('morador');
    expect(initialDemoState.areaSelecionada).toBe('quadra');
  });

  it('slotSelecionado começa null e ultimaConfirmacao começa null', () => {
    expect(initialDemoState.slotSelecionado).toBeNull();
    expect(initialDemoState.ultimaConfirmacao).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// SWITCH_VIEW — alterna aba sem tocar em nenhum outro campo (Property 7)
// ────────────────────────────────────────────────────────────────────────────

describe('SWITCH_VIEW', () => {
  it('alterna view morador → sindico preservando demais campos', () => {
    const next = apply(initialDemoState, {
      type: 'SWITCH_VIEW',
      view: 'sindico',
    });

    expect(next.view).toBe('sindico');
    // Preservação estrita de referência: `{ ...state, view }` não toca
    // em nenhum outro campo, então todas as referências permanecem idênticas.
    expect(next.areaSelecionada).toBe(initialDemoState.areaSelecionada);
    expect(next.slotSelecionado).toBe(initialDemoState.slotSelecionado);
    expect(next.reservasPorArea).toBe(initialDemoState.reservasPorArea);
    expect(next.ultimaConfirmacao).toBe(initialDemoState.ultimaConfirmacao);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// SELECT_AREA — troca de área reseta slotSelecionado
// ────────────────────────────────────────────────────────────────────────────

describe('SELECT_AREA', () => {
  it('troca de quadra para deck e reseta slotSelecionado', () => {
    // Seleciona um slot válido na quadra primeiro.
    const comSlot = apply(initialDemoState, {
      type: 'SELECT_SLOT',
      slot: '09:00',
    });
    expect(comSlot.slotSelecionado).toBe('09:00');

    // Ao trocar para deck, o slot destacado deve sumir para evitar que
    // a seleção da área anterior "vaze" visualmente para a nova grade.
    const noDeck = apply(comSlot, { type: 'SELECT_AREA', area: 'deck' });
    expect(noDeck.areaSelecionada).toBe('deck');
    expect(noDeck.slotSelecionado).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// SELECT_SLOT — aceitação + todas as guardas defensivas (no-op)
// ────────────────────────────────────────────────────────────────────────────

describe('SELECT_SLOT', () => {
  it('seleciona slot livre na Quadra', () => {
    // 09:00 não está no seed [10:00, 14:00, 15:00, 20:00], fim = 11:00 ≤ 22:00.
    const next = apply(initialDemoState, {
      type: 'SELECT_SLOT',
      slot: '09:00',
    });
    expect(next.slotSelecionado).toBe('09:00');
  });

  it('NÃO seleciona slot ocupado (10:00 está no seed)', () => {
    const next = apply(initialDemoState, {
      type: 'SELECT_SLOT',
      slot: '10:00',
    });
    // No-op canônico: o reducer retorna a própria referência de entrada,
    // o que permite detecção barata de "houve mudança?" via `===`.
    expect(next).toBe(initialDemoState);
  });

  it('NÃO seleciona 21:00 porque 21+2=23 > 22:00', () => {
    // Corrige o Bug #6 do HTML original (Property 5, Req. 3.8).
    const next = apply(initialDemoState, {
      type: 'SELECT_SLOT',
      slot: '21:00',
    });
    expect(next).toBe(initialDemoState);
  });

  it('NÃO seleciona slot em Piscina', () => {
    // Property 8 (Req. 3.10): Piscina é informativa, nunca aceita
    // seleção de slot independentemente do horário passado.
    const noPiscina = apply(
      initialDemoState,
      { type: 'SELECT_AREA', area: 'piscina' },
      { type: 'SELECT_SLOT', slot: '10:00' },
    );
    expect(noPiscina.areaSelecionada).toBe('piscina');
    expect(noPiscina.slotSelecionado).toBeNull();
  });

  it('NÃO seleciona slot que não está em slotsBase', () => {
    // 07:00 é anterior ao primeiro slot da Quadra (08:00); defesa
    // contra entradas inválidas vindas de fora do reducer.
    const next = apply(initialDemoState, {
      type: 'SELECT_SLOT',
      slot: '07:00',
    });
    expect(next).toBe(initialDemoState);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// CONFIRM — sucesso, idempotência (Property 3) e no-ops
// ────────────────────────────────────────────────────────────────────────────

describe('CONFIRM', () => {
  it('confirma reserva adicionando slot a reservasPorArea', () => {
    const final = apply(
      initialDemoState,
      { type: 'SELECT_SLOT', slot: '09:00' },
      { type: 'CONFIRM' },
    );

    expect(final.reservasPorArea.quadra).toContain('09:00');
    // Seed tinha 4 reservas; após confirmar deve ter 5.
    expect(final.reservasPorArea.quadra).toHaveLength(5);
    expect(final.slotSelecionado).toBeNull();
    expect(final.ultimaConfirmacao).toEqual({
      area: 'quadra',
      slot: '09:00',
      fim: '11:00',
    });
  });

  it('é idempotente — confirmar mesmo slot duas vezes não duplica', () => {
    // Property 3 / Req. 12.7: reservar o mesmo slot duas vezes não
    // aumenta a lista nem introduz duplicatas.
    const apos1 = apply(
      initialDemoState,
      { type: 'SELECT_SLOT', slot: '09:00' },
      { type: 'CONFIRM' },
    );
    expect(apos1.reservasPorArea.quadra).toHaveLength(5);

    // Tenta repetir: SELECT_SLOT é no-op (09:00 agora está ocupado) e
    // CONFIRM é no-op (slotSelecionado === null após a 1ª confirmação).
    const apos2 = apply(
      apos1,
      { type: 'SELECT_SLOT', slot: '09:00' },
      { type: 'CONFIRM' },
    );
    expect(apos2.reservasPorArea.quadra).toHaveLength(5);
    expect(new Set(apos2.reservasPorArea.quadra).size).toBe(
      apos2.reservasPorArea.quadra.length,
    );
  });

  it('não confirma quando slotSelecionado é null', () => {
    const next = apply(initialDemoState, { type: 'CONFIRM' });
    expect(next).toBe(initialDemoState);
  });

  it('fim da reserva da Quadra é slot + 2h', () => {
    const apos09 = apply(
      initialDemoState,
      { type: 'SELECT_SLOT', slot: '09:00' },
      { type: 'CONFIRM' },
    );
    expect(apos09.ultimaConfirmacao?.fim).toBe('11:00');

    // Reinicia com RESET para garantir seleção do 08:00 (também livre
    // pois não está no seed) sem interferência da confirmação anterior.
    const apos08 = apply(
      apos09,
      { type: 'RESET' },
      { type: 'SELECT_SLOT', slot: '08:00' },
      { type: 'CONFIRM' },
    );
    expect(apos08.ultimaConfirmacao?.fim).toBe('10:00');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// RESET — volta à referência canônica do initialDemoState
// ────────────────────────────────────────────────────────────────────────────

describe('RESET', () => {
  it('volta ao initialDemoState após várias ações', () => {
    const final = apply(
      initialDemoState,
      { type: 'SELECT_SLOT', slot: '09:00' },
      { type: 'CONFIRM' },
      { type: 'SWITCH_VIEW', view: 'sindico' },
      { type: 'RESET' },
    );
    // Referência idêntica (e não só igualdade estrutural): o reducer
    // retorna o próprio `initialDemoState` em RESET, o que torna
    // `state === initialDemoState` um teste barato de "demo foi resetada?".
    expect(final).toBe(initialDemoState);
  });
});

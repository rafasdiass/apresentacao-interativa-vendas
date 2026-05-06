// Feature: apresentacao-interativa-vendas, Property 1: Totalização do investimento
// *For all* propostas `p`, a soma de `p.investimento.itens[].valorCentavos` SHALL
// ser exatamente igual a `p.investimento.totalCentavos`, e entradaPct+saldoPct === 100.
// Validates: Requirements 2.4, 2.6, 2.10, 12.4

import { describe, expect, it } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  diasRestantes,
  proposta as basePr,
  validarProposta,
  type ItemInvestimento,
  type Proposta,
} from '../proposta';

/**
 * Constrói uma `Proposta` a partir do literal canônico, aplicando apenas os
 * campos em `overrides`. Preserva todas as demais invariantes do literal para
 * que cada teste isole exatamente a mutação de interesse.
 */
function makeProposta(overrides: {
  itens?: readonly ItemInvestimento[];
  totalCentavos?: number;
  entradaPct?: number;
  saldoPct?: number;
  validadeDias?: number;
}): Proposta {
  return {
    ...basePr,
    cabecalho: {
      ...basePr.cabecalho,
      validadeDias: overrides.validadeDias ?? basePr.cabecalho.validadeDias,
    },
    investimento: {
      ...basePr.investimento,
      itens: overrides.itens ?? basePr.investimento.itens,
      totalCentavos: overrides.totalCentavos ?? basePr.investimento.totalCentavos,
      condicoesPagamento: {
        ...basePr.investimento.condicoesPagamento,
        entradaPct:
          overrides.entradaPct ?? basePr.investimento.condicoesPagamento.entradaPct,
        saldoPct:
          overrides.saldoPct ?? basePr.investimento.condicoesPagamento.saldoPct,
      },
    },
  };
}

/** Soma `valorCentavos` de um array de itens de investimento. */
function soma(itens: readonly ItemInvestimento[]): number {
  return itens.reduce((acc, item) => acc + item.valorCentavos, 0);
}

/**
 * Arbitrário de array não-vazio de `ItemInvestimento`. Bounds conservadores
 * (20 itens × 10^9 centavos) mantêm a soma máxima em 2×10^10, três ordens de
 * grandeza abaixo de `Number.MAX_SAFE_INTEGER` — `soma + 1` nunca sofre
 * wrap-around de ponto flutuante.
 */
const itemInvestimentoArb = fc.record({
  descricao: fc.string({ minLength: 1, maxLength: 40 }),
  valorCentavos: fc.integer({ min: 0, max: 1_000_000_000 }),
});

const itensArb = fc.array(itemInvestimentoArb, { minLength: 1, maxLength: 20 });

describe('validarProposta — casos exemplares (Property 1)', () => {
  it('aceita o literal canônico de proposta.ts', () => {
    expect(() => validarProposta(basePr)).not.toThrow();
  });

  it('rejeita totalCentavos que não bate com a soma dos itens', () => {
    const p = makeProposta({ totalCentavos: basePr.investimento.totalCentavos + 1 });
    expect(() => validarProposta(p)).toThrow(/Totalização inválida/);
  });

  it('rejeita entradaPct + saldoPct !== 100', () => {
    const p = makeProposta({ entradaPct: 50, saldoPct: 60 });
    expect(() => validarProposta(p)).toThrow(/Condições de pagamento inválidas/);
  });

  it('rejeita validadeDias <= 0', () => {
    const p = makeProposta({ validadeDias: 0 });
    expect(() => validarProposta(p)).toThrow(/Validade inválida/);
  });

  it('rejeita lista de itens vazia', () => {
    const p = makeProposta({ itens: [] });
    expect(() => validarProposta(p)).toThrow(/Itens de investimento vazios/);
  });
});

describe('validarProposta — propriedades (Property 1)', () => {
  test.prop([itensArb], { numRuns: 100 })(
    'para todo array de itens, total = soma(itens) passa e total = soma+1 falha',
    (itens) => {
      const totalCorreto = soma(itens);

      const propostaOk = makeProposta({ itens, totalCentavos: totalCorreto });
      expect(() => validarProposta(propostaOk)).not.toThrow();

      const propostaRuim = makeProposta({ itens, totalCentavos: totalCorreto + 1 });
      expect(() => validarProposta(propostaRuim)).toThrow(/Totalização inválida/);
    },
  );

  test.prop([fc.integer({ min: 0, max: 100 })], { numRuns: 100 })(
    'entrada + saldo == 100 passa; entrada + saldo == 101 falha',
    (entradaPct) => {
      const pOk = makeProposta({ entradaPct, saldoPct: 100 - entradaPct });
      expect(() => validarProposta(pOk)).not.toThrow();

      const pRuim = makeProposta({ entradaPct, saldoPct: 100 - entradaPct + 1 });
      expect(() => validarProposta(pRuim)).toThrow(/Condições de pagamento inválidas/);
    },
  );
});

// Property 10: Validade monotônica
// *For all* datas d:
//   se d > dataEmissao + validadeDias * 1 dia, então diasRestantes(p, d) <= 0
//   se d < dataEmissao, então diasRestantes(p, d) >= validadeDias
// Validates: Requirements 4.8
describe('diasRestantes — Property 10', () => {
  const EMISSAO = Date.parse(`${basePr.cabecalho.dataEmissao}T00:00:00Z`);
  const VENCIMENTO_MS = EMISSAO + basePr.cabecalho.validadeDias * 86_400_000;

  it('retorna validadeDias na data de emissão (05/05/2026 00:00 UTC)', () => {
    expect(diasRestantes(basePr, new Date('2026-05-05T00:00:00Z'))).toBe(30);
  });

  it('retorna 0 no instante exato do vencimento (04/06/2026 00:00 UTC)', () => {
    expect(diasRestantes(basePr, new Date('2026-06-04T00:00:00Z'))).toBe(0);
  });

  it('retorna -1 um dia após o vencimento (05/06/2026 00:00 UTC)', () => {
    expect(diasRestantes(basePr, new Date('2026-06-05T00:00:00Z'))).toBe(-1);
  });

  it('retorna validadeDias+1 um dia antes da emissão (04/05/2026 00:00 UTC)', () => {
    expect(diasRestantes(basePr, new Date('2026-05-04T00:00:00Z'))).toBe(31);
  });

  test.prop([fc.integer({ min: 1, max: 10_000 })], { numRuns: 200 })(
    'após vencimento, diasRestantes <= 0',
    (diasAposVencimento) => {
      const d = new Date(VENCIMENTO_MS + diasAposVencimento * 86_400_000);
      expect(diasRestantes(basePr, d)).toBeLessThanOrEqual(0);
    },
  );

  test.prop([fc.integer({ min: 1, max: 10_000 })], { numRuns: 200 })(
    'antes da emissão, diasRestantes >= validadeDias',
    (diasAntesEmissao) => {
      const d = new Date(EMISSAO - diasAntesEmissao * 86_400_000);
      expect(diasRestantes(basePr, d)).toBeGreaterThanOrEqual(
        basePr.cabecalho.validadeDias,
      );
    },
  );

  test.prop(
    [
      fc.integer({ min: EMISSAO - 100 * 86_400_000, max: EMISSAO + 100 * 86_400_000 }),
      fc.integer({ min: 0, max: 100 * 86_400_000 }),
    ],
    { numRuns: 200 },
  )(
    'diasRestantes é monotonicamente não-crescente em `hoje`',
    (t1, offset) => {
      const t2 = t1 + offset;
      expect(diasRestantes(basePr, new Date(t1))).toBeGreaterThanOrEqual(
        diasRestantes(basePr, new Date(t2)),
      );
    },
  );
});

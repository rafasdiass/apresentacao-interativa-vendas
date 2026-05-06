// Feature: apresentacao-interativa-vendas, Property 2: Round-trip de formatação monetária
// *For all* valores inteiros c em centavos (0 ≤ c ≤ 1e11),
//   parseMoeda(formatarMoeda(c)) === c.
// Validates: Requirements 2.8, 12.8

import { describe, it, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { formatarMoeda, parseMoeda } from '../proposta';

describe('formatarMoeda — casos exemplares', () => {
  it.each<[number, string]>([
    [0, 'R$ 0,00'],
    [1, 'R$ 0,01'],
    [100, 'R$ 1,00'],
    [15_000, 'R$ 150,00'],
    [1_500_000, 'R$ 15.000,00'],
    [1_850_000, 'R$ 18.500,00'],
    [3_350_000, 'R$ 33.500,00'],
    [115_000, 'R$ 1.150,00'],
  ])('formatarMoeda(%i) === %s', (centavos, esperado) => {
    expect(formatarMoeda(centavos)).toBe(esperado);
  });

  it('lança erro quando recebe valor não-inteiro', () => {
    expect(() => formatarMoeda(1.5)).toThrow(/inteiro/);
  });
});

describe('parseMoeda — rejeição de entrada malformada', () => {
  it.each<[string, string]>([
    ['', 'string vazia'],
    ['R$', 'apenas prefixo'],
    ['15,00', 'sem prefixo R$'],
    ['R$ 15.00', 'separador decimal errado'],
    ['R$ 15,0', 'precisão decimal errada'],
  ])('rejeita %j (%s)', (formatado) => {
    expect(() => parseMoeda(formatado)).toThrow(/formato inválido/);
  });
});

// Property test 2 — round-trip canônico: parseMoeda ∘ formatarMoeda === id
test.prop([fc.integer({ min: 0, max: 100_000_000_000 })], { numRuns: 1000 })(
  'parseMoeda(formatarMoeda(c)) === c para todo inteiro c em [0, 1e11]',
  (c) => {
    expect(parseMoeda(formatarMoeda(c))).toBe(c);
  },
);

// Property test 2b — o output sempre casa com o formato canônico `R$ X.XXX,XX`
test.prop([fc.integer({ min: 0, max: 100_000_000_000 })], { numRuns: 200 })(
  'formatarMoeda sempre produz string no formato R$ X.XXX,XX',
  (c) => {
    const s = formatarMoeda(c);
    expect(s).toMatch(/^R\$\s\d{1,3}(\.\d{3})*,\d{2}$/);
  },
);

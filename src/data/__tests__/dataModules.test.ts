// Unit tests for static data modules: demoConfig, benchmark, navegacao
// Validates: Requirements 1.1, 3.10, 5.1

import { describe, expect, it } from 'vitest';
import {
  AREAS,
  KPIS_SINDICO,
  ACOES_RAPIDAS_SINDICO,
  ULTIMAS_RESERVAS_MOCK,
} from '../demoConfig';
import { BENCHMARK, FONTES_BENCHMARK } from '../benchmark';
import { SECOES } from '../navegacao';

describe('demoConfig — AREAS', () => {
  it('piscina não é reservável', () => {
    expect(AREAS.piscina.reservavel).toBe(false);
  });

  it('piscina não tem slots base', () => {
    expect(AREAS.piscina.slotsBase).toHaveLength(0);
  });

  it('quadra aceita reservas com limite de 2h', () => {
    expect(AREAS.quadra.reservavel).toBe(true);
    expect(AREAS.quadra.duracaoMaxHoras).toBe(2);
  });

  it('quadra tem 14 slots base de 08:00 a 21:00', () => {
    expect(AREAS.quadra.slotsBase).toHaveLength(14);
    expect(AREAS.quadra.slotsBase[0]).toBe('08:00');
    expect(AREAS.quadra.slotsBase.at(-1)).toBe('21:00');
  });

  it('deck é reservável com blocos de 4h e 7 slots', () => {
    expect(AREAS.deck.reservavel).toBe(true);
    expect(AREAS.deck.duracaoMaxHoras).toBe(4);
    expect(AREAS.deck.slotsBase).toHaveLength(7);
  });

  it('fechamento de dias úteis e fim de semana das áreas reserváveis', () => {
    expect(AREAS.quadra.fechamentoDiaUtil).toBe('22:00');
    expect(AREAS.quadra.fechamentoFimDeSemana).toBe('00:00');
    expect(AREAS.deck.fechamentoDiaUtil).toBe('22:00');
  });

  it('cada chave bate com o id interno', () => {
    const ids = ['quadra', 'deck', 'piscina'] as const;
    for (const id of ids) {
      expect(AREAS[id].id).toBe(id);
    }
  });
});

describe('demoConfig — KPIS_SINDICO', () => {
  it('contém exatamente 4 KPIs', () => {
    expect(KPIS_SINDICO).toHaveLength(4);
  });

  it('tem "Reservas hoje" com valor 23', () => {
    const entry = KPIS_SINDICO.find((k) => k.label === 'Reservas hoje');
    expect(entry).toBeDefined();
    expect(entry?.valor).toBe('23');
  });

  it('tem "Casas ativas" 487 (de 520 unidades)', () => {
    const entry = KPIS_SINDICO.find((k) => k.label === 'Casas ativas');
    expect(entry).toBeDefined();
    expect(entry?.valor).toBe('487');
    expect(entry?.delta).toBe('de 520 unidades');
  });
});

describe('demoConfig — ACOES_RAPIDAS_SINDICO', () => {
  it('tem 3 ações rápidas', () => {
    expect(ACOES_RAPIDAS_SINDICO).toHaveLength(3);
  });

  it('todas têm titulo e descricao não-vazios', () => {
    ACOES_RAPIDAS_SINDICO.forEach((a) => {
      expect(a.titulo.length).toBeGreaterThan(0);
      expect(a.descricao.length).toBeGreaterThan(20);
    });
  });
});

describe('demoConfig — ULTIMAS_RESERVAS_MOCK', () => {
  it('preserva as 4 reservas do HTML original', () => {
    expect(ULTIMAS_RESERVAS_MOCK).toHaveLength(4);
    expect(ULTIMAS_RESERVAS_MOCK.map((r) => r.casa)).toEqual([
      'Casa 247',
      'Casa 089',
      'Casa 401',
      'Casa 134',
    ]);
  });
});

describe('benchmark — BENCHMARK', () => {
  it('tem 4 linhas', () => {
    expect(BENCHMARK).toHaveLength(4);
  });

  it('primeira linha é "Esta proposta (Lavita Code)"', () => {
    expect(BENCHMARK[0]?.opcao).toBe('Esta proposta (Lavita Code)');
  });

  it('todas as linhas têm custoInicial, custoMensal, prazoEntrega preenchidos', () => {
    BENCHMARK.forEach((linha) => {
      expect(linha.custoInicial.length).toBeGreaterThan(0);
      expect(linha.custoMensal.length).toBeGreaterThan(0);
      expect(linha.prazoEntrega.length).toBeGreaterThan(0);
    });
  });

  it('matches snapshot', () => {
    expect(BENCHMARK).toMatchSnapshot();
  });
});

describe('benchmark — FONTES_BENCHMARK', () => {
  it('tem pelo menos 3 notas de rodapé', () => {
    expect(FONTES_BENCHMARK.length).toBeGreaterThanOrEqual(3);
  });
});

describe('navegacao — SECOES', () => {
  it('tem exatamente 8 seções', () => {
    expect(SECOES).toHaveLength(8);
  });

  it('ids aparecem na ordem esperada', () => {
    expect(SECOES.map((s) => s.id)).toEqual([
      'hero',
      'demo',
      'escopo',
      'cronograma',
      'investimento',
      'benchmarking',
      'diferenciais',
      'aceite',
    ]);
  });

  it('cada seção tem label não-vazio', () => {
    SECOES.forEach((s) => {
      expect(s.label.length).toBeGreaterThan(0);
    });
  });

  it('todas as seções têm notasApresentador', () => {
    SECOES.forEach((s) => {
      expect(s.notasApresentador).toBeDefined();
    });
  });
});

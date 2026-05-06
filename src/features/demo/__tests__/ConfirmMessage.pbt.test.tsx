/**
 * src/features/demo/__tests__/ConfirmMessage.pbt.test.tsx — Property test
 * P4 da feature `demo-morador-mvp-polish` (Task 8.4).
 *
 * **Property 4 — Texto da ConfirmMessage**: para qualquer `UltimaConfirmacao`
 * válida (derivada do domínio real — área reservável + slot da grade base
 * cuja duração máxima não ultrapassa o fechamento do dia útil), o banner
 * `role="status"` renderizado pelo `<ConfirmMessage>` inclui a frase fixa
 * "Reserva confirmada", o nome humano da área (`AREAS[area].nome`) e os
 * horários de início (`slot`) e fim (`fim`).
 *
 * Isoladamente do `<DemoMorador>`: o objetivo é verificar o contrato de
 * apresentação do próprio componente, sem depender de estado do reducer
 * nem de outros componentes do mockup. O arbitrário monta manualmente o
 * `{area, slot, fim}` usando os mesmos helpers temporais do reducer
 * (`addHoras`, `closingToMinutes`, `fimComoSlot`) para garantir que apenas
 * combinações que o reducer também aceitaria sejam geradas — reflete a
 * Property 5 do spec pai (slots fora-do-expediente nunca chegam ao
 * `ultimaConfirmacao`).
 *
 * Apenas `'quadra'` e `'deck'` entram na amostra porque a Piscina não é
 * reservável e, portanto, `ultimaConfirmacao.area` nunca assume esse valor
 * (Property 8 do spec pai). Cobrir somente o domínio semanticamente válido
 * torna o teste focado no contrato de texto — falhas apontam problemas de
 * apresentação, não de seleção de domínio.
 */

// Feature: demo-morador-mvp-polish, Property 4: Texto da ConfirmMessage

import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ConfirmMessage } from '../components/ConfirmMessage';
import { AREAS } from '@/data/demoConfig';
import { addHoras, closingToMinutes, fimComoSlot } from '../demoReducer';
import type { UltimaConfirmacao } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// Arbitrary
// ────────────────────────────────────────────────────────────────────────────

/**
 * Gera uma `UltimaConfirmacao` que o `demoReducer` seria capaz de
 * produzir: área reservável (`'quadra' | 'deck'`), slot da grade base
 * da área cuja janela `[slot, slot + duracaoMaxHoras]` não passa do
 * fechamento do dia útil, e `fim` calculado pelos mesmos helpers
 * temporais do reducer.
 */
const reservableAreaArb = fc.constantFrom('quadra' as const, 'deck' as const);

const ultimaConfirmacaoArb: fc.Arbitrary<UltimaConfirmacao> =
  reservableAreaArb.chain((area) => {
    const cfg = AREAS[area];
    const fechamento = closingToMinutes(cfg.fechamentoDiaUtil);
    const slotsValidos = cfg.slotsBase.filter(
      (s) => addHoras(s, cfg.duracaoMaxHoras) <= fechamento,
    );
    return fc.constantFrom(...slotsValidos).map((slot) => ({
      area,
      slot,
      fim: fimComoSlot(addHoras(slot, cfg.duracaoMaxHoras)),
    }));
  });

// ────────────────────────────────────────────────────────────────────────────
// Feature: demo-morador-mvp-polish, Property 4: Texto da ConfirmMessage
// Validates: Requirements 9.5
// ────────────────────────────────────────────────────────────────────────────

describe('Property 4 — Texto da ConfirmMessage', () => {
  test.prop([ultimaConfirmacaoArb], { numRuns: 100 })(
    'o banner role="status" contém "Reserva confirmada", o nome da área e os horários',
    (uc) => {
      render(<ConfirmMessage ultimaConfirmacao={uc} />);

      const status = screen.getByRole('status');
      const text = status.textContent ?? '';

      expect(text).toContain('Reserva confirmada');
      expect(text).toContain(AREAS[uc.area].nome);
      expect(text).toContain(uc.slot);
      expect(text).toContain(uc.fim);

      cleanup();
    },
  );
});

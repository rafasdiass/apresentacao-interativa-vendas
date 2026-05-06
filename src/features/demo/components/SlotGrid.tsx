/**
 * src/features/demo/components/SlotGrid.tsx — Grade 3-col de horários.
 *
 * Renderiza um grid de botões, um por slot da área atualmente
 * selecionada. Cada botão é pintado segundo o `status` derivado pelo
 * helper `slotsComStatus` (Task 5.3):
 *
 *   - `'ocupado'` — `disabled`, texto riscado, cinza, cursor
 *     `not-allowed`. Comunica visualmente a reserva existente e bloqueia
 *     nova seleção (Property 3 / Req. 3.7).
 *   - `'fora-do-expediente'` — `disabled`, fundo levemente destacado em
 *     `bg-bg-tertiary` e `title="Fora do horário"`. Cobre o bug #6 do
 *     HTML original (`21:00 + 2h` excede o fechamento 22h) e o caso de
 *     Piscina (sem slots), deixando a razão visível no tooltip.
 *   - `'livre'` — enabled. Quando `slot === slotSelecionado`, adiciona
 *     `aria-pressed="true"` e estilo destacado (`bg-accent-primary`)
 *     para reforçar o feedback do toque.
 *
 * Se `slotsComStatus` está vazio (Piscina, pelas regras de
 * `demoConfig.ts`), renderiza uma mensagem explicativa em lugar do
 * grid — mantém a área informativa sem simular controle que não
 * existe no app real.
 *
 * ARIA: wrapper é `role="group"` com rótulo acessível. O grupo **não**
 * é um `radiogroup` porque nem todos os botões são seleções mutuamente
 * exclusivas (há botões desabilitados) — é apenas um agrupamento
 * semântico para leitores de tela.
 *
 * Requirements: 3.5, 3.7, 3.8, 9.3, 11.5
 */

import type { Slot, SlotComStatus } from '../types';

export interface SlotGridProps {
  readonly slotsComStatus: readonly SlotComStatus[];
  readonly slotSelecionado: Slot | null;
  readonly onSelect: (slot: Slot) => void;
}

export function SlotGrid({
  slotsComStatus,
  slotSelecionado,
  onSelect,
}: SlotGridProps): JSX.Element {
  if (slotsComStatus.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        Esta área é informativa — não aceita reservas via app.
      </p>
    );
  }

  return (
    <div
      role="group"
      aria-label="Grade de horários disponíveis"
      className="grid grid-cols-3 gap-2"
    >
      {slotsComStatus.map(({ slot, status }) => {
        if (status === 'ocupado') {
          return (
            <button
              key={slot}
              type="button"
              disabled
              aria-label={`${slot} — ocupado`}
              className="cursor-not-allowed rounded-md border border-border-primary bg-bg-secondary px-2 py-1.5 text-sm text-text-tertiary line-through"
            >
              {slot}
            </button>
          );
        }

        if (status === 'fora-do-expediente') {
          return (
            <button
              key={slot}
              type="button"
              disabled
              title="Fora do horário"
              aria-label={`${slot} — fora do horário`}
              className="cursor-not-allowed rounded-md border border-border-primary bg-bg-tertiary px-2 py-1.5 text-sm text-text-tertiary"
            >
              {slot}
            </button>
          );
        }

        const selecionado = slot === slotSelecionado;
        const livreClasses = selecionado
          ? 'bg-accent-primary text-text-on-dark border-accent-primary'
          : 'bg-bg-secondary hover:bg-bg-tertiary border-border-primary text-text-primary';

        return (
          <button
            key={slot}
            type="button"
            aria-pressed={selecionado}
            onClick={() => onSelect(slot)}
            className={`rounded-md border px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${livreClasses}`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}

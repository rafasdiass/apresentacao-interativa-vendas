/**
 * src/features/demo/components/SlotGrid.tsx — Grade 3-col de horários
 * com altura fixa (`h-52`) ou bloco informativo para áreas não-reserváveis.
 *
 * Ponto crítico do Requisito 1.7: a altura deste componente é **constante**
 * em qualquer estado. O wrapper externo é sempre `h-52` (208px), e ambos
 * os caminhos (grade reservável e bloco informativo) se encaixam dentro
 * desse orçamento — a Quadra com 14 slots em `grid-cols-3` ocupa 5 linhas
 * de `h-8` + gaps e padding vertical, o Deck com 7 slots ocupa 3 linhas,
 * e o bloco informativo da Piscina centraliza conteúdo no mesmo espaço.
 *
 * Cada slot vira um `<button>` de `h-8` (32px) com classes por status:
 *
 *   - `livre` não selecionado — fundo claro (`bg-bg-primary`), borda
 *     secundária, texto escuro; hover troca para `bg-bg-tertiary`.
 *   - `livre` selecionado — fundo `accent-primary`, texto branco em
 *     negrito, borda acentuada. Comunica a escolha atual.
 *   - `ocupado` — `disabled`, cinza claro (`bg-bg-tertiary`), texto
 *     terciário com `line-through` e cursor `not-allowed`. Bloqueia
 *     reseleção (Property 3 / Req 3.7 do spec pai).
 *   - `fora-do-expediente` — `disabled`, hachura diagonal sutil via
 *     `background-image: repeating-linear-gradient(...)` diferencia
 *     visualmente de `ocupado` sem depender apenas do `title` (Req 7.1).
 *
 * ARIA:
 *   - Grade: `role="group"` + `aria-label="Grade de horários disponíveis"`.
 *     Slots livres usam `aria-pressed={selecionado}` (padrão toggle).
 *     Slots ocupados usam `aria-label="HH:MM — ocupado"`; fora do
 *     expediente usam `aria-label="HH:MM — fora do horário"` +
 *     `title="Fora do horário"` (Req 7.6).
 *   - Bloco Piscina: `role="note"`, sem `role="group"` — não é um
 *     agrupamento de controles, é um aviso informativo.
 *
 * Requirements: 1.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 11.6
 */

import type { Slot, SlotComStatus } from '../types';
import { AreaIcon } from './icons/AreaIcon';

export interface SlotGridProps {
  readonly slotsComStatus: readonly SlotComStatus[];
  readonly slotSelecionado: Slot | null;
  readonly onSelect: (slot: Slot) => void;
}

/**
 * Padrão de hachura diagonal aplicado via `style` aos slots
 * `fora-do-expediente`. Fica em uma constante para reduzir ruído no JSX
 * e tornar explícita a intenção de diferenciação visual.
 */
const HACHURA_FORA_EXPEDIENTE = {
  backgroundImage:
    'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.04) 4px 8px)',
} as const;

export function SlotGrid({
  slotsComStatus,
  slotSelecionado,
  onSelect,
}: SlotGridProps): JSX.Element {
  // Caminho Piscina (ou qualquer área sem slots) — bloco informativo
  // centralizado que respeita o orçamento `h-52` do slot do MobileMockup.
  if (slotsComStatus.length === 0) {
    return (
      <div
        role="note"
        className="flex h-52 flex-col items-center justify-center gap-2 text-center"
      >
        <AreaIcon
          id="piscina"
          className="w-12 h-12 text-accent-primary"
        />
        <p className="text-sm font-semibold text-text-primary">Piscina</p>
        <p className="text-xs text-text-secondary">
          Esta área é informativa — não aceita reservas via app.
        </p>
        <p className="text-xs text-text-tertiary">
          Confira os horários direto na portaria.
        </p>
      </div>
    );
  }

  // Caminho reservável — grade 3 colunas de altura fixa. `content-start`
  // alinha as linhas ao topo para áreas com poucos slots (Deck) sem
  // esticar a altura dos botões.
  return (
    <div
      role="group"
      aria-label="Grade de horários disponíveis"
      className="grid h-52 grid-cols-3 content-start gap-2 overflow-hidden py-2"
    >
      {slotsComStatus.map(({ slot, status }) => {
        if (status === 'ocupado') {
          return (
            <button
              key={slot}
              type="button"
              disabled
              aria-label={`${slot} — ocupado`}
              className="h-8 cursor-not-allowed rounded-md border border-border-primary bg-bg-tertiary text-xs text-text-tertiary line-through"
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
              style={HACHURA_FORA_EXPEDIENTE}
              className="h-8 cursor-not-allowed rounded-md border border-border-primary bg-bg-secondary text-xs text-text-tertiary"
            >
              {slot}
            </button>
          );
        }

        const selecionado = slot === slotSelecionado;
        const livreClasses = selecionado
          ? 'bg-accent-primary text-text-on-dark border-accent-primary font-bold'
          : 'bg-bg-primary text-text-primary border-border-secondary hover:bg-bg-tertiary transition-colors duration-150';

        return (
          <button
            key={slot}
            type="button"
            aria-pressed={selecionado}
            onClick={() => onSelect(slot)}
            className={`h-8 rounded-md border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${livreClasses}`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}

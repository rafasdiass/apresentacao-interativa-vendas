/**
 * src/features/demo/components/AreaCard.tsx — Card de seleção de Area_Comum.
 *
 * Renderiza um dos três cards de áreas (Quadra, Deck, Piscina) na linha 4
 * do `MobileMockup`. Altura fixa `h-16` (Req 6.3/6.4) em qualquer estado,
 * layout flex-column com ícone no topo e nome abaixo.
 *
 * Três estados visuais possíveis:
 *
 *   1. **Reservável + não selecionada** — borda `border-primary`, fundo
 *      `bg-bg-primary`, hover troca para `bg-bg-tertiary` +
 *      `border-border-secondary`.
 *   2. **Reservável + selecionada** — borda dobrada `accent-primary` +
 *      `bg-accent-primary/10`, comunicando a escolha feita.
 *   3. **Informativa** (`area.reservavel === false`, hoje apenas Piscina) —
 *      exibe um badge "Informativa" no canto superior direito; não tem
 *      hover (paridade com o `demoReducer`, que faz no-op em tentativas
 *      de seleção de slot em áreas informativas).
 *
 * ARIA: o componente se comporta como um item de `radiogroup` — o pai
 * (`DemoMorador`) envolve os três cards num elemento `role="radiogroup"`.
 * Aqui expomos `role="radio"` + `aria-checked={selecionada}`, consistente
 * com o modelo de seleção única de área.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.5
 */

import type { AreaConfig } from '../types';
import { AreaIcon } from './icons/AreaIcon';

export interface AreaCardProps {
  readonly area: AreaConfig;
  readonly selecionada: boolean;
  readonly onClick: () => void;
}

export function AreaCard({
  area,
  selecionada,
  onClick,
}: AreaCardProps): JSX.Element {
  const baseClasses =
    'relative flex h-16 flex-col items-start justify-between rounded-md border px-2 py-1.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';

  const stateClasses = selecionada
    ? 'border-accent-primary border-2 bg-accent-primary/10'
    : 'border-border-primary bg-bg-primary';

  const hoverClasses = area.reservavel
    ? 'hover:bg-bg-tertiary hover:border-border-secondary'
    : '';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selecionada}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${hoverClasses}`}
    >
      <AreaIcon id={area.id} className="w-6 h-6 text-accent-primary" />
      <span className="text-xs font-semibold text-text-primary">
        {area.nome}
      </span>
      {!area.reservavel && (
        <span className="absolute right-1 top-1 rounded-sm bg-bg-tertiary px-1 text-[10px] text-text-tertiary">
          Informativa
        </span>
      )}
    </button>
  );
}

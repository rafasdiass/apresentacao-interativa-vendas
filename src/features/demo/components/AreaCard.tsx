/**
 * src/features/demo/components/AreaCard.tsx — Card de seleção de Area_Comum.
 *
 * Renderiza um dos três cards de áreas (Quadra, Deck, Piscina) no topo do
 * `MobileMockup`. Três estados visuais possíveis:
 *
 *   1. **Reservável + não selecionada** — borda `border-primary`, fundo
 *      `bg-secondary`.
 *   2. **Reservável + selecionada** — borda `accent-primary` e fundo
 *      `bg-tertiary`, comunicando a escolha feita.
 *   3. **Informativa** (`area.reservavel === false`, hoje apenas Piscina) —
 *      exibe um badge "Informativa" no canto superior direito e uma
 *      legenda na parte inferior. O cartão permanece clicável para manter
 *      paridade com o HTML original, mas o `demoReducer` faz no-op em
 *      qualquer tentativa de seleção de slot (Property 8 / Req. 3.10).
 *
 * ARIA: o componente se comporta como um item de `radiogroup` — o pai
 * (`DemoMorador`) envolve os três cards num elemento `role="radiogroup"`.
 * Aqui expomos `role="radio"` + `aria-checked={selecionada}`, consistente
 * com o modelo de seleção única de área.
 *
 * Requirements: 3.4, 3.10, 10.4, 11.5
 */

import type { AreaConfig } from '../types';

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
    'relative flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';

  const stateClasses = selecionada
    ? 'border-accent-primary bg-bg-tertiary'
    : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary';

  const hint = area.reservavel ? 'Reservável' : 'Informativa — sem reservas';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selecionada}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      {!area.reservavel && (
        <span className="absolute right-2 top-1 rounded-sm bg-bg-tertiary px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-text-secondary">
          Informativa
        </span>
      )}
      <span className="text-xs font-semibold text-text-primary">
        {area.nome}
      </span>
      <span className="mt-0.5 text-[10px] text-text-tertiary">{hint}</span>
    </button>
  );
}

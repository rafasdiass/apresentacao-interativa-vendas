/**
 * src/features/demo/components/MobileMockup.tsx — Moldura visual do
 * mockup mobile no qual a Demo do Morador é renderizada.
 *
 * Preserva o visual do HTML original: frame azul-marinho arredondado,
 * status bar fake no topo ("9:41" + ícones abstratos) e header do app
 * com rótulo da casa ("CASA 247 · BLOCO B") e saudação. O `children` é
 * a área de conteúdo claro onde `DemoMorador` insere seus cards,
 * grid de slots e CTA de reserva.
 *
 * Este componente é intencionalmente **puramente visual**: não conhece
 * o estado da Demo, o reducer ou o hook. Qualquer mudança de layout
 * (bordas, padding, tipografia do mockup) acontece aqui sem tocar em
 * componentes de lógica.
 *
 * Elementos decorativos (ícones fake da status bar) são marcados com
 * `aria-hidden="true"` para não poluir leitores de tela (Req. 9.6).
 *
 * Requirements: 3.3, 11.1
 */

import type { ReactNode } from 'react';

export interface MobileMockupProps {
  readonly children: ReactNode;
}

export function MobileMockup({ children }: MobileMockupProps): JSX.Element {
  return (
    <div className="mx-auto max-w-[320px] overflow-hidden rounded-[2rem] border-4 border-gray-900 bg-surface-dark shadow-2xl">
      {/* Status bar */}
      <div className="flex items-center justify-between bg-surface-dark px-4 py-1 text-xs text-text-on-dark">
        <span aria-hidden="true">9:41</span>
        <span aria-hidden="true" className="tracking-widest">
          ● ● ●
        </span>
      </div>

      {/* App header */}
      <header className="border-b border-white/10 bg-surface-dark px-4 py-3 text-text-on-dark">
        <p className="text-[10px] uppercase tracking-wider opacity-70">
          CASA 247 · BLOCO B
        </p>
        <p className="text-base font-medium">Olá, morador 👋</p>
      </header>

      {/* Content area */}
      <div className="space-y-4 bg-bg-secondary p-4">{children}</div>
    </div>
  );
}

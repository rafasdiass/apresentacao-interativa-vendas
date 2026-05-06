/**
 * src/features/demo/components/HighlightBanner.tsx — Banner decorativo de destaque do MobileMockup.
 *
 * Reproduz o visual de um card de destaque (tipo "próximos eventos") logo abaixo
 * do cabeçalho do app mobile, reforçando a sensação de produto real para a
 * apresentação de vendas. O conteúdo é estático — não reflete o estado do
 * reducer — e o ícone é marcado `aria-hidden="true"` (feito no próprio
 * `InfoIcon`) porque o texto já comunica a mensagem. Altura fixa `h-14` (56px)
 * ancora a terceira faixa do grid do `MobileMockup`.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */

import { InfoIcon } from './icons/InfoIcon';

export function HighlightBanner(): JSX.Element {
  return (
    <div
      data-testid="highlight-banner"
      className="mx-4 mt-2 flex h-14 items-center gap-2 rounded-md border border-accent-primary/30 bg-accent-primary/10 px-3 text-xs text-text-primary"
    >
      <InfoIcon className="w-4 h-4 shrink-0 text-accent-primary" />
      <span>Próxima reserva: Quadra hoje às 14:00</span>
    </div>
  );
}

/**
 * src/features/demo/components/ConfirmMessage.tsx — Feedback acessível
 * após um `CONFIRM` bem-sucedido.
 *
 * Recebe o `ultimaConfirmacao` do estado da Demo. Quando `null` (antes
 * de qualquer reserva), retorna `null` — nada é renderizado. O wrapper
 * `h-10` no `MobileMockup` (`[data-testid="confirm-message-slot"]`) já
 * reserva o espaço desde o primeiro render, então retornar `null` aqui
 * não causa reflow (Requisito 9.1).
 *
 * Quando presente, exibe um banner verde com `role="status"` +
 * `aria-live="polite"` para que leitores de tela anunciem a confirmação
 * no momento em que ela aparece, sem interromper o fluxo (Req 9.4). O
 * `CheckIcon` à esquerda é decorativo (o texto já comunica sucesso) e
 * a animação `slide-in-up` de 240ms produz o fade+translate de entrada
 * (Req 9.2) respeitando `prefers-reduced-motion` via regra global em
 * `src/index.css` (Req 9.6).
 *
 * O nome legível da área vem de `AREAS[area].nome`, que é a fonte única
 * de verdade para os rótulos.
 *
 * Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 11.7
 */

import { AREAS } from '@/data/demoConfig';
import type { UltimaConfirmacao } from '../types';
import { CheckIcon } from './icons/CheckIcon';

export interface ConfirmMessageProps {
  readonly ultimaConfirmacao: UltimaConfirmacao | null;
}

export function ConfirmMessage({
  ultimaConfirmacao,
}: ConfirmMessageProps): JSX.Element | null {
  if (ultimaConfirmacao === null) return null;

  const { area, slot, fim } = ultimaConfirmacao;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-10 items-center gap-2 rounded-md border border-accent-primary bg-accent-primary/10 px-2 text-xs text-accent-primary animate-[slide-in-up_240ms_ease-out]"
    >
      <CheckIcon className="w-4 h-4 shrink-0" />
      <span>
        Reserva confirmada: {AREAS[area].nome} das {slot} às {fim}.
      </span>
    </div>
  );
}

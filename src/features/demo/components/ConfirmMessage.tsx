/**
 * src/features/demo/components/ConfirmMessage.tsx — Feedback acessível
 * após um `CONFIRM` bem-sucedido.
 *
 * Recebe o `ultimaConfirmacao` do estado da Demo. Quando `null` (antes
 * de qualquer reserva), retorna `null` — nada é renderizado. Quando
 * presente, exibe um banner verde com `role="status"` +
 * `aria-live="polite"` para que leitores de tela anunciem a confirmação
 * no momento em que ela aparece, sem interromper o fluxo.
 *
 * O nome legível da área vem de `AREAS[area].nome`, que é a fonte única
 * de verdade para os rótulos (Task 3.1).
 *
 * Requirements: 3.6, 9.4
 */

import { AREAS } from '@/data/demoConfig';
import type { UltimaConfirmacao } from '../types';

export interface ConfirmMessageProps {
  readonly ultimaConfirmacao: UltimaConfirmacao | null;
}

export function ConfirmMessage({
  ultimaConfirmacao,
}: ConfirmMessageProps): JSX.Element | null {
  if (ultimaConfirmacao === null) return null;

  const { area, slot, fim } = ultimaConfirmacao;
  const areaNome = AREAS[area].nome;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-md border border-accent-primary bg-accent-primary/10 p-3 text-sm text-accent-primary"
    >
      Reserva confirmada: {areaNome} das {slot} às {fim}.
    </div>
  );
}

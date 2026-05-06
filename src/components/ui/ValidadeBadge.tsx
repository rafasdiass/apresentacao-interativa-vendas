/**
 * src/components/ui/ValidadeBadge.tsx — Badge de validade da Proposta.
 *
 * Exibe quantos dias restam até o vencimento da Proposta, usando o helper
 * `diasRestantes` (Task 2.2). O resultado é renderizado com cor semântica
 * que muda conforme a urgência:
 *
 *   - `dias > 15`   → verde  (`status-positive`) — tranquilo.
 *   - `dias ∈ [1..15]` → amarelo (`status-warning`)  — urgência moderada.
 *   - `dias ≤ 0`    → vermelho (`status-negative`) — expirado.
 *
 * O pluralização do rótulo ("1 dia restante" vs. "2 dias restantes") é
 * tratada inline, evitando um helper de i18n só para isso.
 *
 * A prop opcional `hoje` permite testes determinísticos (forçando uma data
 * de referência); em produção o default `new Date()` é calculado a cada
 * render, o que é intencional para que recarregar a página atualize o
 * contador automaticamente.
 *
 * Requirements: 4.8
 */

import { proposta, diasRestantes } from '@/data/proposta';

export interface ValidadeBadgeProps {
  /** Data de referência. Default: `new Date()`. */
  readonly hoje?: Date;
}

export function ValidadeBadge({
  hoje = new Date(),
}: ValidadeBadgeProps): JSX.Element {
  const dias = diasRestantes(proposta, hoje);

  let tom: string;
  let label: string;
  if (dias <= 0) {
    tom = 'bg-status-negative/10 text-status-negative border-status-negative';
    label = 'Validade expirada';
  } else if (dias <= 15) {
    tom = 'bg-status-warning/10 text-status-warning border-status-warning';
    label = `Validade: ${dias} dia${dias === 1 ? '' : 's'} restante${
      dias === 1 ? '' : 's'
    }`;
  } else {
    tom = 'bg-status-positive/10 text-status-positive border-status-positive';
    label = `Validade: ${dias} dias restantes`;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tom}`}
    >
      {label}
    </span>
  );
}

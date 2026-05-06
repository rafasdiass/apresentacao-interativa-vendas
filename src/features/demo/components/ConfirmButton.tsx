/**
 * src/features/demo/components/ConfirmButton.tsx — CTA de confirmação
 * de reserva no mockup Morador.
 *
 * Dois estados visuais:
 *
 *   - **Habilitado** (`podeConfirmar && slotSelecionado && fim`): texto
 *     `"Reservar HH:MM – HH:MM"`, fundo verde de confirmação, ativo.
 *   - **Desabilitado**: texto `"Selecione um horário"`, fundo cinza,
 *     `disabled`. Cobre tanto "nenhum slot escolhido" quanto "área
 *     não reservável" — a decisão já foi tomada pelo helper
 *     `podeConfirmar` (Task 5.3).
 *
 * As props `slotSelecionado` e `fim` são `Slot | null` por consistência
 * com o hook `useDemoReservas`; aqui só as lemos quando todas as três
 * condições abaixo valem (tipagem garantida por guarda).
 *
 * Requirements: 3.5, 3.6, 9.4
 */

import type { Slot } from '../types';

export interface ConfirmButtonProps {
  readonly podeConfirmar: boolean;
  readonly slotSelecionado: Slot | null;
  readonly fim: Slot | null;
  readonly onConfirm: () => void;
}

export function ConfirmButton({
  podeConfirmar,
  slotSelecionado,
  fim,
  onConfirm,
}: ConfirmButtonProps): JSX.Element {
  const ativo = podeConfirmar && slotSelecionado !== null && fim !== null;

  const label = ativo
    ? `Reservar ${slotSelecionado} – ${fim}`
    : 'Selecione um horário';

  const stateClasses = ativo
    ? 'bg-accent-primary text-text-on-dark hover:brightness-110'
    : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed';

  return (
    <button
      type="button"
      disabled={!ativo}
      onClick={onConfirm}
      className={`w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 ${stateClasses}`}
    >
      {label}
    </button>
  );
}

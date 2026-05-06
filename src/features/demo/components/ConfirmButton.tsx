/**
 * src/features/demo/components/ConfirmButton.tsx — CTA de confirmação
 * de reserva no mockup Morador.
 *
 * Dois estados visuais, mas sempre renderiza o `<button>` (nunca `null`),
 * garantindo altura fixa (`h-10`) e a presença de
 * `[data-testid="confirm-button"]` em qualquer estado do reducer:
 *
 *   - **Habilitado** (`podeConfirmar === true`): fundo
 *     `bg-accent-primary`, texto `text-text-on-dark font-bold`,
 *     ícone `<CheckIcon />` + rótulo `"Reservar HH:MM – HH:MM"`.
 *   - **Desabilitado**: fundo `bg-bg-tertiary`, texto
 *     `text-text-tertiary italic`, rótulo `"Selecione um horário"`
 *     (sem ícone) + `cursor-not-allowed`.
 *
 * `disabled` segue estritamente `podeConfirmar`; `slotSelecionado`/`fim`
 * são consultados apenas para compor o rótulo quando habilitado —
 * se qualquer um for `null` (cenário defensivo, não esperado sob
 * `podeConfirmar === true`), caímos no rótulo de desabilitado.
 *
 * Feedback de press via `active:scale-[0.98]` com
 * `transition-transform duration-100`. `focus-visible` preservado.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 11.2
 */

import type { Slot } from '../types';
import { CheckIcon } from './icons/CheckIcon';

export interface ConfirmButtonProps {
  readonly podeConfirmar: boolean;
  readonly slotSelecionado: Slot | null;
  readonly fim: Slot | null;
  readonly onConfirm: () => void;
}

const BASE_CLASSES =
  'flex h-10 w-full items-center justify-center gap-2 rounded-md transition-transform duration-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';

const ENABLED_CLASSES = 'bg-accent-primary text-text-on-dark font-bold';

const DISABLED_CLASSES =
  'bg-bg-tertiary text-text-tertiary italic cursor-not-allowed';

export function ConfirmButton({
  podeConfirmar,
  slotSelecionado,
  fim,
  onConfirm,
}: ConfirmButtonProps): JSX.Element {
  const mostrarRotuloAtivo =
    podeConfirmar && slotSelecionado !== null && fim !== null;

  const stateClasses = podeConfirmar ? ENABLED_CLASSES : DISABLED_CLASSES;

  return (
    <button
      data-testid="confirm-button"
      type="button"
      disabled={!podeConfirmar}
      onClick={onConfirm}
      className={`${BASE_CLASSES} ${stateClasses}`}
    >
      {mostrarRotuloAtivo ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>{`Reservar ${slotSelecionado} – ${fim}`}</span>
        </>
      ) : (
        <span>Selecione um horário</span>
      )}
    </button>
  );
}

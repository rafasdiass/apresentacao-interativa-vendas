// Modal — primitiva acessível baseada no elemento nativo `<dialog>`.
//
// Por que `<dialog>` nativo?
//   - Focus trap e fechamento via tecla Esc vêm prontos no navegador.
//   - `::backdrop` já renderiza o overlay escuro sem portais manuais.
//   - O `role="dialog"` + `aria-modal="true"` é adicionado explicitamente
//     porque navegadores mais antigos não expõem role dialog no elemento.
//
// Esta primitiva é reutilizada por `TooltipFeature`, `DialogoFluxoMorador`
// e `DialogoArquiteturaBackend` (task 7.10 da spec), substituindo os
// `sendPrompt(...)` indefinidos do HTML original.

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

export interface ModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  /** Optional label for the close button. Default: "Fechar". */
  readonly closeLabel?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  closeLabel = 'Fechar',
}: ModalProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Abre/fecha o <dialog> conforme a prop `open`. `showModal()` lança
  // `InvalidStateError` se chamado em um dialog já aberto, por isso os guards.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Propaga o fechamento nativo (tecla Esc ou `.close()`) para o pai.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = (): void => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Bloqueia scroll do body enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Click no backdrop (event.target === o próprio <dialog>) fecha o modal.
  // Cliques em elementos filhos têm target diferente e não disparam.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>): void => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className="w-full max-w-lg rounded-md border border-border-primary bg-bg-secondary p-0 text-text-primary shadow-xl backdrop:bg-black/50"
    >
      <div className="relative p-6">
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>
        <h2
          id={titleId}
          className="mb-4 pr-10 font-heading text-lg font-semibold text-text-primary"
        >
          {title}
        </h2>
        <div className="text-sm text-text-secondary">{children}</div>
      </div>
    </dialog>
  );
}

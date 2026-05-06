// TooltipFeature — popover informativo ativado por clique.
//
// Em vez de um tooltip tradicional baseado em `hover`, usamos um modal
// pequeno aberto por clique. Isso garante paridade entre desktop e mobile
// (hover não existe em touch) e herda a acessibilidade nativa do <dialog>
// (focus trap, tecla Esc). Caso de uso principal: os 3 cards de "Ações
// rápidas" do painel do Síndico, que substituem as chamadas indefinidas
// de `sendPrompt(...)` do HTML original.

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Modal } from './Modal';

export interface TooltipFeatureProps {
  readonly titulo: string;
  readonly descricao: string;
  /** Trigger children — usually text or a small label. */
  readonly children: ReactNode;
  /** Optional className to forward to the trigger button. */
  readonly className?: string;
}

export function TooltipFeature({
  titulo,
  descricao,
  children,
  className,
}: TooltipFeatureProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'inline-flex items-center gap-1 text-sm text-text-info hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2'
        }
      >
        {children}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={titulo}>
        <p className="text-sm text-text-secondary">{descricao}</p>
      </Modal>
    </>
  );
}

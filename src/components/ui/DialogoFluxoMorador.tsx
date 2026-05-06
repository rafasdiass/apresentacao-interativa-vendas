// DialogoFluxoMorador — modal explicando o fluxo completo do app Morador.
//
// Substitui o botão "Ver fluxo completo do morador ↗" do HTML original, que
// chamava `sendPrompt(...)` (função indefinida, conforme Bug #1 da análise
// de artefatos). O conteúdo está alinhado ao escopo da Proposta: Quadra com
// limite de 2h, Deck com bloco exclusivo de 4h, notificações push.

import { Modal } from './Modal';

export interface DialogoFluxoMoradorProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function DialogoFluxoMorador({
  open,
  onClose,
}: DialogoFluxoMoradorProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Fluxo completo do Morador">
      <ol className="list-decimal list-inside space-y-3 text-sm text-text-secondary">
        <li>
          <span className="font-semibold text-text-primary">Login: </span>
          Acesso por número da casa + senha individual. Sessão persistente por 30
          dias no dispositivo.
        </li>
        <li>
          <span className="font-semibold text-text-primary">
            Calendário das áreas:{' '}
          </span>
          Morador vê a grade de horários em tempo real. Horários ocupados
          aparecem cinzas e riscados; horários fora do expediente também ficam
          bloqueados.
        </li>
        <li>
          <span className="font-semibold text-text-primary">
            Seleção de slot:{' '}
          </span>
          Toque em um horário livre; a reserva é calculada automaticamente
          (início + 2h na quadra; bloco de 4h no deck).
        </li>
        <li>
          <span className="font-semibold text-text-primary">Confirmação: </span>
          Um tap em &ldquo;Reservar&rdquo; registra a reserva, envia push de
          confirmação e atualiza o histórico em &ldquo;Minhas reservas&rdquo;.
        </li>
        <li>
          <span className="font-semibold text-text-primary">
            Cancelamento e mural:{' '}
          </span>
          Cancelar reservas antecipadamente pelo histórico. O mural avisa quando
          áreas ficam indisponíveis (manutenção, feriado).
        </li>
      </ol>
      <p className="mt-4 border-t border-border-primary pt-3 text-xs text-text-tertiary">
        Este modal substitui o botão original &ldquo;Ver fluxo completo do
        morador ↗&rdquo; do HTML, que chamava a função indefinida{' '}
        <code className="rounded-sm bg-bg-tertiary px-1 py-0.5 text-text-secondary">
          sendPrompt
        </code>
        .
      </p>
    </Modal>
  );
}

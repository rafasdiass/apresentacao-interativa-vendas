// DialogoArquiteturaBackend — modal com detalhes técnicos do backend.
//
// Substitui o botão "Detalhes técnicos ↗" do HTML original, que chamava a
// função indefinida `sendPrompt(...)`. O conteúdo cita as garantias de
// concorrência (unique constraint, lock otimista) que impedem double-booking
// e explica o perfil de segurança e observabilidade alinhado à Proposta.

import { Modal } from './Modal';

export interface DialogoArquiteturaBackendProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function DialogoArquiteturaBackend({
  open,
  onClose,
}: DialogoArquiteturaBackendProps): JSX.Element {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Arquitetura de concorrência do backend"
    >
      <ul className="list-disc list-inside space-y-3 text-sm text-text-secondary">
        <li>Todas as reservas passam pelo backend NestJS + PostgreSQL.</li>
        <li>
          Unique constraint{' '}
          <code className="rounded-sm bg-bg-tertiary px-1 py-0.5 text-text-primary">
            (area_id, slot_inicio, data)
          </code>{' '}
          no banco — duas reservas simultâneas do mesmo slot falham na segunda
          insert com SQLSTATE 23505 e o cliente recebe 409 Conflict.
        </li>
        <li>
          Lock otimista via{' '}
          <code className="rounded-sm bg-bg-tertiary px-1 py-0.5 text-text-primary">
            version
          </code>{' '}
          column em{' '}
          <code className="rounded-sm bg-bg-tertiary px-1 py-0.5 text-text-primary">
            reserva
          </code>{' '}
          protege cancelamentos concorrentes do mesmo registro.
        </li>
        <li>
          Autenticação: JWT de curta duração (15 min) + refresh token de 30 dias
          armazenado em{' '}
          <code className="rounded-sm bg-bg-tertiary px-1 py-0.5 text-text-primary">
            httpOnly cookie
          </code>
          .
        </li>
        <li>
          Observabilidade: logs estruturados JSON + Pino → CloudWatch; métricas
          Prometheus-compatíveis para latência e taxa de erro por endpoint.
        </li>
      </ul>
      <p className="mt-4 border-t border-border-primary pt-3 text-xs text-text-tertiary">
        Este modal substitui o botão original &ldquo;Detalhes técnicos ↗&rdquo;.
      </p>
    </Modal>
  );
}

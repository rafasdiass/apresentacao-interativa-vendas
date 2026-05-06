/**
 * src/components/layout/ScrollReminderToast.tsx — Lembrete discreto de CTA.
 *
 * Componente de apresentação puro (sem estado interno além do que o pai
 * passa). A lógica de detecção — scroll > 70% do documento, dismissal,
 * rastreamento de interação com CTAs — fica em `Layout.tsx` (Task 12.1).
 * Aqui recebemos `scrolledPastThreshold` e `dismissed` já resolvidos, e
 * renderizamos (ou não) o toast.
 *
 * Acessibilidade: o toast usa `role="status"` + `aria-live="polite"` para
 * que leitores de tela anunciem a mensagem sem interromper leitura em
 * andamento. O botão de dismissal tem `aria-label` explícito.
 *
 * Posição responsiva:
 *   - Desktop (>= md): canto superior direito, não bloqueia o conteúdo
 *     principal.
 *   - Mobile (< md): inferior centralizado, acima do `CTAFloating` (que
 *     fica ancorado em `bottom-0`). Deixamos 72px de margem para não
 *     colidir.
 *
 * Requirements: 4.6
 */

export interface ScrollReminderToastProps {
  /** Calculado em Layout.tsx: scrollY / scrollMax > 0.7. */
  readonly scrolledPastThreshold: boolean;
  /** Dismissal da sessão (não persiste entre reloads; Req. 4.6). */
  readonly dismissed: boolean;
  /** Callback chamado ao clicar em "Fechar". */
  readonly onDismiss: () => void;
}

export function ScrollReminderToast({
  scrolledPastThreshold,
  dismissed,
  onDismiss,
}: ScrollReminderToastProps): JSX.Element | null {
  if (!scrolledPastThreshold || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-40 flex items-center gap-3 rounded-md border border-border-primary bg-bg-primary p-3 shadow-lg md:inset-x-auto md:bottom-auto md:right-4 md:top-20 md:max-w-sm"
    >
      <p className="flex-1 text-sm text-text-primary">
        Gostou? Avance com um clique.
      </p>
      <a
        href="#aceite"
        className="rounded-md bg-accent-primary px-3 py-1.5 text-sm font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
      >
        Ir ao aceite
      </a>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar lembrete"
        className="rounded-sm px-2 py-1 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
      >
        Fechar
      </button>
    </div>
  );
}

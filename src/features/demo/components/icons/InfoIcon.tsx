/**
 * src/features/demo/components/icons/InfoIcon.tsx — Ícone de informação.
 *
 * Usado no `HighlightBanner` ao lado do texto de destaque. Decorativo
 * (`aria-hidden="true"`) — o texto do banner já transmite a mensagem.
 *
 * Requirements: 5.3, 5.6
 */

export function InfoIcon({
  className,
}: {
  readonly className?: string;
}): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-4 h-4 ${className ?? ''}`}
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2Zm0-8h-2V7h2Z" />
    </svg>
  );
}

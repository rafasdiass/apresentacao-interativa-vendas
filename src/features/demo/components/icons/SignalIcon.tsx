/**
 * src/features/demo/components/icons/SignalIcon.tsx — Ícone de sinal.
 *
 * Mini-ícone decorativo da `StatusBar` (4 barras crescentes). Não carrega
 * informação funcional — `aria-hidden="true"` no elemento raiz, pareado
 * com a `StatusBar` inteira marcada decorativa.
 *
 * Requirements: 3.2
 */

export function SignalIcon({
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
      <path d="M3 17h2v4H3zm5-4h2v8H8zm5-4h2v12h-2zm5-5h2v17h-2z" />
    </svg>
  );
}

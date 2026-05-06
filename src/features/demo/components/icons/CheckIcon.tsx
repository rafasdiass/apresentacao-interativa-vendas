/**
 * src/features/demo/components/icons/CheckIcon.tsx — Ícone de check.
 *
 * Usado no `ConfirmButton` (estado habilitado) e na `ConfirmMessage` para
 * sinalizar sucesso da reserva. Decorativo — o texto adjacente já comunica
 * a ação/estado, então o SVG é `aria-hidden="true"`.
 *
 * Requirements: 8.2, 9.3
 */

export function CheckIcon({
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
      <path d="M9.55 17.35 4.2 12l1.4-1.4 3.95 3.95L18.4 5.7l1.4 1.4Z" />
    </svg>
  );
}

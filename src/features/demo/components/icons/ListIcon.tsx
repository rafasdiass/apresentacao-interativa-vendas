/**
 * src/features/demo/components/icons/ListIcon.tsx — Ícone de lista.
 *
 * Decorativo na `BottomTabBar` (item "Atividades"). O rótulo textual
 * adjacente cobre a acessibilidade; o SVG é `aria-hidden="true"`.
 *
 * Requirements: 10.3
 */

export function ListIcon({
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
      <path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z" />
    </svg>
  );
}

/**
 * src/features/demo/components/icons/HomeIcon.tsx — Ícone de casa.
 *
 * Decorativo na `BottomTabBar` (item "Home", ativo por default). O rótulo
 * textual "Home" já comunica o item, então o SVG é `aria-hidden="true"`.
 *
 * Requirements: 10.3
 */

export function HomeIcon({
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
      <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3Z" />
    </svg>
  );
}

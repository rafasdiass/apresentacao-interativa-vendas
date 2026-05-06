/**
 * src/features/demo/components/icons/BellIcon.tsx — Ícone de sino.
 *
 * Decorativo no `AppHeader` (com badge de notificações) e reutilizado na
 * `BottomTabBar` (item "Avisos"). O SVG é `aria-hidden="true"`; o rótulo
 * acessível vem do texto "Avisos" na tab ou é omitido no header (o sino
 * lá é puramente visual).
 *
 * Requirements: 4.3, 10.3
 */

export function BellIcon({
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
      <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1Z" />
    </svg>
  );
}

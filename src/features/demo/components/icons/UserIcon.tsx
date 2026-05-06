/**
 * src/features/demo/components/icons/UserIcon.tsx — Ícone de usuário.
 *
 * Decorativo na `BottomTabBar` (item "Perfil"). `aria-hidden="true"` —
 * o rótulo "Perfil" ao lado basta.
 *
 * Requirements: 10.3
 */

export function UserIcon({
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
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
    </svg>
  );
}

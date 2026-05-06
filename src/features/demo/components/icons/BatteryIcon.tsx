/**
 * src/features/demo/components/icons/BatteryIcon.tsx — Ícone de bateria.
 *
 * Mini-ícone decorativo da `StatusBar` (retângulo com nível interno cheio).
 * `aria-hidden="true"` — apenas adorno de home screen.
 *
 * Requirements: 3.2
 */

export function BatteryIcon({
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
      <path d="M3 9h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm1 2v2h14v-2Zm17 0h1v2h-1Z" />
    </svg>
  );
}

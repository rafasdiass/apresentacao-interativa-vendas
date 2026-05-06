/**
 * src/features/demo/components/icons/WifiIcon.tsx — Ícone de Wi-Fi.
 *
 * Mini-ícone decorativo da `StatusBar` (arcos concêntricos). `aria-hidden="true"`
 * — a presença do Wi-Fi é parte do visual do mockup, não da semântica da página.
 *
 * Requirements: 3.2
 */

export function WifiIcon({
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
      <path d="M12 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm-5.6-5.4 1.4 1.4a6 6 0 0 1 8.4 0l1.4-1.4a8 8 0 0 0-11.2 0ZM2.2 10.4l1.4 1.4a12 12 0 0 1 16.8 0l1.4-1.4a14 14 0 0 0-19.6 0Z" />
    </svg>
  );
}

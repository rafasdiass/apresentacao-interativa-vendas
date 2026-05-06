/**
 * src/features/demo/components/icons/AreaIcon.tsx — Ícone por Area_Comum.
 *
 * Mapa `id → SVG inline` com três variantes pictográficas:
 *
 *   - `quadra`   → bola (círculo com curvas internas sugerindo vôlei)
 *   - `deck`     → retângulo com chama (churrasqueira / área de fogo)
 *   - `piscina`  → onda (padrão senoidal sugerindo água)
 *
 * Todos os SVGs usam `fill="currentColor"` para herdar a cor do container
 * (ex.: `text-accent-primary` no `AreaCard`), `viewBox="0 0 24 24"` para
 * escalar com `className` (default `w-4 h-4`, override livre via prop) e
 * `aria-hidden="true"` no elemento raiz — o rótulo acessível é fornecido
 * pelo texto adjacente nos cards e no bloco informativo da Piscina.
 *
 * Requirements: 3.2, 6.1, 6.2, 7.8
 */

import type { AreaId } from '../../types';

export interface AreaIconProps {
  readonly id: AreaId;
  readonly className?: string;
}

export function AreaIcon({ id, className }: AreaIconProps): JSX.Element {
  const cls = `w-4 h-4 ${className ?? ''}`;
  switch (id) {
    case 'quadra':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cls}
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.9 0 3.6.7 5 1.8-1.4 1.6-2.3 3.6-2.4 5.8-2-.9-3.7-2.4-4.9-4.3A8 8 0 0 1 12 4Zm-5.5 3.2C7.9 9.3 9.8 11 12 12c-.1 2.2-.9 4.3-2.3 5.9A8 8 0 0 1 4.2 10c.5-1 1.3-2 2.3-2.8Zm11 0c1 .8 1.8 1.8 2.3 2.8a8 8 0 0 1-5.5 7.9c-1.4-1.6-2.2-3.7-2.3-5.9 2.2-1 4.1-2.7 5.5-4.8Z" />
        </svg>
      );
    case 'deck':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cls}
        >
          <path d="M12 2c.6 1.5.4 2.7-.3 3.6-.8 1.1-1 2-.4 3 .5.7 1.3 1 1.8.4.4-.5.4-1.2 0-1.7 1.6.6 2.4 2.1 2.4 3.6 0 2-1.6 3.1-3.5 3.1S8.5 12.9 8.5 11c0-2.4 1.8-4 2.8-5.3.8-1 .9-2.4.7-3.7Z" />
          <path d="M4 14h16v2H4zm1 3h14l-1 4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1l-1-4Z" />
        </svg>
      );
    case 'piscina':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cls}
        >
          <path d="M2 17c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.6 1 3.3 1v2c-1.7 0-1.7 1-3.3 1s-1.7-1-3.4-1-1.6 1-3.3 1-1.7-1-3.3-1-1.7 1-3.4 1S3.7 19 2 19v-2Zm2-5c1.2 0 1.6-.5 2.5-.8V5a2 2 0 0 1 2-2c.9 0 1.5.4 1.9 1l1.3 1.9-1.6 1.2-1.3-1.9a.2.2 0 0 0-.3 0V6h5V4h2v9.2c-.8.2-1.2.8-2.5.8-1.7 0-1.7-1-3.3-1S6.2 14 4.5 14c-.2 0-.3 0-.5-.1V12Z" />
        </svg>
      );
  }
}

/**
 * src/components/layout/CTAFloating.tsx — CTA persistente "Aceitar proposta".
 *
 * Componente de apresentação puro: recebe via prop a decisão sobre
 * visibilidade e apenas renderiza (ou não) o botão flutuante. A lógica
 * de "estou visível?" fica em `Layout.tsx` (Task 12.1), que combina
 * posição de scroll (> 100vh) e visibilidade da seção `#aceite` — se o
 * usuário já está olhando o bloco de aceite, não faz sentido sobrepor
 * mais um CTA em cima dele.
 *
 * Comportamento responsivo:
 *   - Desktop (>= md): pílula arredondada no canto inferior direito.
 *   - Mobile (< md): barra full-width ancorada no rodapé, sem cantos
 *     arredondados para alinhar com o formato de "bottom bar" típico de
 *     apps mobile. Permanece sempre acessível dentro do polegar.
 *
 * Este é um `<a>` nativo apontando para `#aceite` — o CSS global de
 * scroll suave cuida da rolagem e respeita `prefers-reduced-motion`.
 *
 * Requirements: 4.5, 12.5
 */

export interface CTAFloatingProps {
  /** Calculado em Layout.tsx: scroll > 100vh e seção `#aceite` fora do viewport. */
  readonly visible: boolean;
}

export function CTAFloating({ visible }: CTAFloatingProps): JSX.Element | null {
  if (!visible) return null;

  return (
    <a
      href="#aceite"
      className="fixed inset-x-0 bottom-0 z-40 bg-accent-primary px-4 py-3 text-center font-semibold text-text-on-dark shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 md:inset-x-auto md:bottom-6 md:right-6 md:rounded-full md:px-5"
    >
      Aceitar proposta
    </a>
  );
}

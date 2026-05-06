/**
 * src/features/demo/components/BottomTabBar.tsx — Tab bar inferior decorativa do MobileMockup.
 *
 * Reproduz o visual de uma tab bar mobile com 4 itens (Home, Atividades, Avisos,
 * Perfil) em grid de 4 colunas. O item "Home" aparece destacado em
 * `text-accent-primary` para sugerir que o mockup está na tela inicial do app;
 * os demais ficam em `text-text-tertiary`. Todo o conteúdo é estático e puramente
 * decorativo — nenhum item é clicável nem focável:
 *
 * - Raiz com `aria-hidden="true"` (leitores de tela ignoram a tab bar inteira).
 * - Cada tab renderizada como `<div>` (não `<button>`, não `<a>`), sem `onClick`
 *   e sem `tabindex`, para que não entrem no fluxo de foco por teclado.
 *
 * Altura fixa `h-14` (56px) ancora a sétima faixa do grid do `MobileMockup`.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 12.7
 */

import { HomeIcon } from './icons/HomeIcon';
import { ListIcon } from './icons/ListIcon';
import { BellIcon } from './icons/BellIcon';
import { UserIcon } from './icons/UserIcon';

const TABS: readonly {
  readonly id: 'home' | 'atividades' | 'avisos' | 'perfil';
  readonly label: string;
  readonly ativo: boolean;
  readonly Icon: (props: { readonly className?: string }) => JSX.Element;
}[] = [
  { id: 'home', label: 'Home', ativo: true, Icon: HomeIcon },
  { id: 'atividades', label: 'Atividades', ativo: false, Icon: ListIcon },
  { id: 'avisos', label: 'Avisos', ativo: false, Icon: BellIcon },
  { id: 'perfil', label: 'Perfil', ativo: false, Icon: UserIcon },
];

export function BottomTabBar(): JSX.Element {
  return (
    <nav
      data-testid="bottom-tab-bar"
      aria-hidden="true"
      className="grid h-14 grid-cols-4 border-t border-white/10 bg-surface-dark"
    >
      {TABS.map(({ id, label, ativo, Icon }) => (
        <div
          key={id}
          className={`flex flex-col items-center justify-center gap-1 ${
            ativo ? 'text-accent-primary' : 'text-text-tertiary'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px]">{label}</span>
        </div>
      ))}
    </nav>
  );
}

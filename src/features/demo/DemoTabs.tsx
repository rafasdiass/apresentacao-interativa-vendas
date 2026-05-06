/**
 * src/features/demo/DemoTabs.tsx — Tablist acessível para alternar
 * entre a aba "Visão do Morador" e a aba "Painel do Síndico".
 *
 * Implementa o padrão ARIA Authoring Practices para *tabs*:
 *
 *   - Wrapper com `role="tablist"` e `aria-label` descritivo.
 *   - Cada botão com `role="tab"`, `aria-selected`, `aria-controls`
 *     apontando para o painel correspondente (IDs `painel-morador` /
 *     `painel-sindico` renderizados por `DemoSection`), e um `id`
 *     estável para que `aria-labelledby` do painel possa referenciá-lo.
 *   - `tabIndex={0}` apenas no tab atualmente selecionado e `-1` no
 *     outro — segue o padrão "roving tabindex" para que a navegação
 *     por teclado (`Tab`) nunca permaneça presa no grupo.
 *   - Navegação por setas (`ArrowLeft` / `ArrowRight`) alterna entre
 *     as duas abas. Como só existem dois tabs, qualquer seta alterna
 *     para o outro (não há wrap-around problemático).
 *
 * **Controle, não estado interno.** A visão atual vive em `DemoSection`
 * (via `useDemoReservas`); este componente apenas reflete a `view`
 * recebida e notifica mudanças pelo `onSwitch`. Isso preserva a
 * Property 7 (Req. 3.2 / 12.9): o reducer da Demo é a única fonte da
 * verdade, garantindo que a alternância Morador ↔ Síndico seja
 * reversível sem perder estado.
 *
 * Requirements: 3.1, 3.2, 9.3, 11.5
 */

import type { KeyboardEvent } from 'react';

export type DemoView = 'morador' | 'sindico';

export interface DemoTabsProps {
  readonly view: DemoView;
  readonly onSwitch: (view: DemoView) => void;
}

interface TabDescriptor {
  readonly id: DemoView;
  readonly label: string;
}

const TABS: readonly TabDescriptor[] = [
  { id: 'morador', label: 'Visão do Morador' },
  { id: 'sindico', label: 'Painel do Síndico' },
];

export function DemoTabs({ view, onSwitch }: DemoTabsProps): JSX.Element {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next: DemoView = view === 'morador' ? 'sindico' : 'morador';
    onSwitch(next);
  };

  return (
    <div
      role="tablist"
      aria-label="Alternar entre visão do Morador e Síndico"
      className="flex gap-2 border-b border-border-primary"
    >
      {TABS.map((tab) => {
        const selected = view === tab.id;
        const baseClasses =
          'px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';
        const stateClasses = selected
          ? 'border-b-2 border-accent-primary font-semibold text-text-primary'
          : 'text-text-secondary hover:text-text-primary';

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`painel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSwitch(tab.id)}
            onKeyDown={handleKeyDown}
            className={`${baseClasses} ${stateClasses}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

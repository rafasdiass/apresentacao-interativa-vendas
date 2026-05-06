/**
 * src/components/layout/NavBar.tsx — Barra de navegação responsiva.
 *
 * Um único componente cobre desktop e mobile (Req. 1.2, 1.5). O
 * comportamento colapsa automaticamente por breakpoint Tailwind (`md:`):
 *
 *   - Desktop (>= 768px): lista horizontal de links dentro do header
 *     `sticky top-0`. Cada link é uma âncora para `#<id>` e o item ativo
 *     recebe `aria-current="location"` + destaque tipográfico.
 *   - Mobile (< 768px): a lista é ocultada (`hidden md:flex`) e é
 *     renderizado um botão hambúrguer que abre um overlay full-screen
 *     com os mesmos itens em coluna. Clicar em qualquer item do overlay
 *     fecha-o automaticamente.
 *
 * Scroll suave: o CSS global (`html { scroll-behavior: smooth }` em
 * `src/index.css`) já cuida disso e respeita `prefers-reduced-motion`.
 * Ainda assim, o handler de clique intercepta a navegação para garantir
 * um alvo de scroll estável (quando o `href` antigo já é o hash atual,
 * o navegador não reage à troca) e para atualizar `location.hash` sem
 * duplicar entradas no histórico.
 *
 * Identidade: exibe "Lavita Code" como marca à esquerda. Conforme o
 * repositório (ver `src/data/navegacao.ts` e `BenchmarkSection`),
 * "Lavita Code" é o nome oficial do desenvolvedor.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 9.1, 9.3
 */

import { useCallback, useEffect, useId, useState } from 'react';
import type { SecaoNav } from '@/data/navegacao';

export interface NavBarProps {
  readonly items: readonly SecaoNav[];
  readonly activeId: string;
}

/** Classe base compartilhada por links desktop e mobile. */
const LINK_BASE =
  'text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary rounded-sm';

/** Intercepta o clique para rolar suavemente e atualizar o hash sem saltos. */
function scrollParaId(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (typeof window !== 'undefined' && window.location.hash !== `#${id}`) {
    window.history.replaceState(null, '', `#${id}`);
  }
}

export function NavBar({ items, activeId }: NavBarProps): JSX.Element {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuId = useId();

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  const aoClicarEmLink = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      scrollParaId(id);
      fecharMenu();
    },
    [fecharMenu],
  );

  // Fecha o overlay em mudança de viewport para desktop (evita estado preso
  // após o usuário rotacionar o dispositivo ou redimensionar a janela).
  useEffect(() => {
    if (typeof window === 'undefined' || !menuAberto) return;
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent): void => {
      if (e.matches) fecharMenu();
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [menuAberto, fecharMenu]);

  // Tecla Esc fecha o overlay mobile.
  useEffect(() => {
    if (!menuAberto) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') fecharMenu();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuAberto, fecharMenu]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur border-b border-border-primary"
    >
      <nav
        role="navigation"
        aria-label="Navegação principal"
        className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"
      >
        <a
          href="#hero"
          onClick={(event) => aoClicarEmLink(event, 'hero')}
          className={`font-heading text-sm font-semibold text-text-primary ${LINK_BASE}`}
        >
          Lavita Code
        </a>

        {/* Desktop: lista horizontal */}
        <ul className="hidden md:flex gap-4">
          {items.map((item) => {
            const ativo = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => aoClicarEmLink(event, item.id)}
                  aria-current={ativo ? 'location' : undefined}
                  className={`${LINK_BASE} ${
                    ativo
                      ? 'font-semibold text-accent-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile: botão hambúrguer */}
        <button
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls={menuId}
          onClick={() => setMenuAberto((v) => !v)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-sm text-text-primary hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            {menuAberto ? '×' : '☰'}
          </span>
        </button>
      </nav>

      {/* Overlay mobile: renderizado sempre, visibilidade controlada pela classe
          para permitir transições se desejado no futuro. Fica acima de tudo
          (`z-50`) e só aparece em viewport < md. */}
      {menuAberto && (
        <nav
          id={menuId}
          aria-label="Menu móvel"
          className="fixed inset-0 z-50 flex flex-col bg-bg-primary p-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm font-semibold text-text-primary">
              Lavita Code
            </span>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={fecharMenu}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-text-primary hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
          </div>
          <ul className="mt-8 flex flex-col gap-4">
            {items.map((item) => {
              const ativo = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => aoClicarEmLink(event, item.id)}
                    aria-current={ativo ? 'location' : undefined}
                    className={`block py-2 text-lg ${LINK_BASE} ${
                      ativo
                        ? 'font-semibold text-accent-primary'
                        : 'text-text-primary'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}

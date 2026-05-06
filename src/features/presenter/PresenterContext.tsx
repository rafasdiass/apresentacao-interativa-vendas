/**
 * src/features/presenter/PresenterContext.tsx — Contexto e Provider do
 * Modo Apresentador (Tasks 10.1 + 10.2).
 *
 * Expõe um contexto React que encapsula o estado do Modo Apresentador
 * (Req. 7). O modo é ligado lendo `?modo=apresentador` da URL **uma
 * única vez** no mount — a flag `active` nunca muda após o primeiro
 * render, o que mantém o resto da árvore imune a re-renders espúrios
 * caso a query string seja alterada por outros motivos.
 *
 * Responsabilidades:
 *
 *   1. **Detectar o modo** a partir de `URLSearchParams(location.search)`
 *      (Req. 7.1). Em ambientes sem `window` (SSR futuro, teste de nó
 *      puro), retorna `false` com segurança.
 *
 *   2. **Navegar entre seções** via `goToSection(i)`. A navegação é
 *      feita por `Element.scrollIntoView({ behavior: 'smooth' })`,
 *      respeitando os mesmos IDs das seções declaradas em
 *      `src/data/navegacao.ts` (consistência com a Property 9 e com a
 *      `NavBar`). Índices fora de [0, SECOES.length) são ignorados
 *      (no-op), o que deixa o handler de teclado simples — bordas não
 *      precisam ser verificadas no consumidor.
 *
 *   3. **Copiar o link de compartilhamento** (Req. 7.4). Preferimos a
 *      Clipboard API moderna; se indisponível (HTTP ou browser antigo),
 *      caímos num fallback com `<textarea>` + `document.execCommand`.
 *
 *   4. **Keybindings globais** (Req. 7.2, Task 10.2). Registrados via
 *      `useEffect` que só é instalado quando `active === true`. O
 *      listener é sempre removido no cleanup, garantindo que desligar
 *      o modo não deixa ouvintes órfãos. `ArrowRight`/`PageDown` avança,
 *      `ArrowLeft`/`PageUp` volta, `Esc` retorna ao Hero.
 *
 * Requirements: 7.1, 7.2, 7.4, 7.5
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { SECOES } from '@/data/navegacao';

/**
 * Valor exposto pelo `PresenterContext`. Campo `active` é somente
 * leitura (determinado no mount); os demais permitem que
 * `PresenterControls` e outros consumidores disparem a navegação e a
 * cópia de link sem precisarem saber detalhes da URL nem do DOM.
 */
export interface PresenterContextValue {
  readonly active: boolean;
  readonly currentSectionIndex: number;
  goToSection(index: number): void;
  copyShareLink(): Promise<void>;
}

const PresenterCtx = createContext<PresenterContextValue | null>(null);

/**
 * Hook de consumo do `PresenterContext`. Lança se usado fora de um
 * `PresenterProvider` — preferimos falhar cedo a silenciosamente
 * devolver valores default que poderiam mascarar integração quebrada.
 */
export function usePresenter(): PresenterContextValue {
  const ctx = useContext(PresenterCtx);
  if (ctx === null) {
    throw new Error('usePresenter must be used within PresenterProvider');
  }
  return ctx;
}

export interface PresenterProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider que materializa o estado do Modo Apresentador. Envolve a
 * árvore da apresentação (normalmente logo abaixo de `<App />`) para
 * que qualquer descendente possa consumir `usePresenter()` sem
 * prop-drilling. A flag `active` é avaliada uma única vez via
 * `useState(initializer)` — isso evita depender de `useMemo` (que
 * poderia ser descartado em React 18 StrictMode) e garante que o
 * estado é definido já no primeiro commit.
 */
export function PresenterProvider({
  children,
}: PresenterProviderProps): JSX.Element {
  // Lê `?modo=apresentador` **uma única vez** no mount. Em SSR/test
  // sem `window`, o modo é desligado por padrão.
  const [active] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      new URLSearchParams(window.location.search).get('modo') === 'apresentador'
    );
  });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const goToSection = useCallback((index: number) => {
    // Ignora índices fora do intervalo: simplifica o código do
    // handler de teclado (não precisa checar bordas) e previne
    // `scrollIntoView` em um elemento inexistente.
    if (index < 0 || index >= SECOES.length) return;
    const section = SECOES[index];
    if (!section) return;
    const el = document.getElementById(section.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrentSectionIndex(index);
  }, []);

  const copyShareLink = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    // Caminho feliz: Clipboard API moderna (requer HTTPS + foco).
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }
    // Fallback para navegadores sem Clipboard API: cria um textarea
    // off-screen, seleciona o conteúdo e usa `execCommand('copy')`.
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }, []);

  // Task 10.2 — Keybindings globais. O efeito só registra o listener
  // quando `active === true`, e sempre limpa no unmount/troca de deps.
  // `currentSectionIndex` entra nas deps para que o handler use o
  // índice atualizado em vez do snapshot capturado no primeiro mount.
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToSection(currentSectionIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSection(currentSectionIndex - 1);
      } else if (e.key === 'Escape') {
        goToSection(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, currentSectionIndex, goToSection]);

  const value = useMemo<PresenterContextValue>(
    () => ({
      active,
      currentSectionIndex,
      goToSection,
      copyShareLink,
    }),
    [active, currentSectionIndex, goToSection, copyShareLink],
  );

  return (
    <PresenterCtx.Provider value={value}>{children}</PresenterCtx.Provider>
  );
}

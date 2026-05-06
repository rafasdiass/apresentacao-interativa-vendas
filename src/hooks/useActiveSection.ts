/**
 * src/hooks/useActiveSection.ts — Hook de scroll-spy para a navegação.
 *
 * Observa os elementos cujos `id`s correspondem aos itens de navegação
 * passados em `items` e devolve o `id` da seção atualmente visível no
 * viewport. É consumido por `Layout.tsx` (Task 12.1) que por sua vez
 * passa o `activeId` para `NavBar` — responsável por destacar o item
 * ativo com `aria-current="location"` (Req. 1.4).
 *
 * Estratégia:
 *   - Usa `IntersectionObserver` nativo com `threshold: 0.4`. Quando
 *     40% da seção fica visível, ela passa a ser a "ativa". O valor foi
 *     escolhido para evitar flicker entre seções adjacentes durante
 *     scroll suave.
 *   - O estado inicial é `items[0]?.id` (normalmente `'hero'`), de forma
 *     que a navegação já abre com algum item destacado antes do primeiro
 *     evento de interseção.
 *   - Em ambientes sem `IntersectionObserver` (ex.: jsdom sem polyfill,
 *     navegadores muito antigos), o efeito é no-op — `activeId` fica
 *     travado no primeiro item. Os consumidores degradam graciosamente.
 *
 * Requirements: 1.4
 */

import { useEffect, useState } from 'react';
import type { SecaoNav } from '@/data/navegacao';

/**
 * Retorna o `id` da seção atualmente visível no viewport dentre os
 * itens fornecidos. O array `items` deve ser estável entre renders
 * (idealmente uma referência de módulo como `SECOES`) — a cada mudança
 * de identidade de `items`, o observer é desconectado e reconstruído.
 */
export function useActiveSection(items: readonly SecaoNav[]): string {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.4 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

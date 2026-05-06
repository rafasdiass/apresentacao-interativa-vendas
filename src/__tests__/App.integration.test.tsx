/**
 * src/__tests__/App.integration.test.tsx — Teste de integração raiz.
 *
 * Cobre a **Property 9 (Consistência de roteamento da navegação)** do
 * design:
 *
 *   *For all* itens `item ∈ SECOES`, SHALL existir no DOM renderizado
 *   um elemento com `id === item.id`.
 *
 * Essa propriedade formaliza o contrato entre `navegacao.ts` (que
 * declara os alvos de âncora) e o App (que renderiza `<section id="...">`
 * para cada um). Quebrar esse contrato silenciosamente — por exemplo
 * remover uma seção mas esquecer de remover o item da `SECOES` — faria
 * links da `NavBar` rolarem para o nada. O espaço de busca é finito
 * (8 itens), então um teste exemplar que itera sobre todos os valores
 * possíveis é equivalente a um PBT exaustivo.
 *
 * Setup mínimo necessário para `<App />` montar em jsdom:
 *
 *   - `IntersectionObserver` não existe nativamente em jsdom; o stub
 *     cobre o uso pelo `useActiveSection` (scroll-spy).
 *   - `HTMLDialogElement.prototype.showModal` / `close` tampouco existem
 *     em jsdom; o `Modal` (Task 7.10) usa `<dialog>` nativo. Como a
 *     Property 9 não abre nenhum modal, basta um stub no-op para
 *     evitar o `TypeError` quando o Modal renderiza.
 *
 * Feature: apresentacao-interativa-vendas, Property 9.
 * Validates: Requirements 1.3, 12.1
 */

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import App from '../App';
import { SECOES } from '@/data/navegacao';

beforeAll(() => {
  // Stub mínimo de IntersectionObserver para o scroll-spy não crashar.
  class IO {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal('IntersectionObserver', IO);

  // `HTMLDialogElement.showModal`/`close` são no-ops em jsdom.
  // Simulamos o toggle do atributo `open` para manter a semântica
  // mínima que o Modal possa observar em futuras asserções.
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement,
    ): void {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
    ): void {
      this.removeAttribute('open');
    };
  }
});

describe('App — Property 9 (consistência de roteamento)', () => {
  it('para cada item em SECOES, existe um elemento com o id correspondente', () => {
    render(<App />);
    for (const item of SECOES) {
      const el = document.getElementById(item.id);
      expect(
        el,
        `Esperava elemento #${item.id} no DOM renderizado por <App />`,
      ).not.toBeNull();
    }
  });
});

/**
 * Suíte separada: varredura automatizada de acessibilidade via axe-core
 * (Task 14.4 / Requirements 9.2, 9.4, 9.6).
 *
 * axe-core no jsdom não é 100% fiel a um navegador real (regras que
 * dependem de layout/cálculo de contraste têm falsos-negativos), então
 * não tratamos essa suíte como prova completa de conformidade WCAG.
 * Em vez disso, exigimos apenas que não haja violações de impacto
 * `critical` ou `serious`, que são as que razoavelmente podem ser
 * detectadas sem rendering real (labels, ARIA, roles, estrutura). A
 * validação completa continua sendo manual + Lighthouse CI em produção.
 */
describe('App — acessibilidade (axe-core)', () => {
  it(
    'não tem violações de acessibilidade críticas ou sérias',
    async () => {
      const { container } = render(<App />);
      const results = await axe.run(container);
      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(criticalOrSerious).toEqual([]);
    },
    20_000,
  );
});

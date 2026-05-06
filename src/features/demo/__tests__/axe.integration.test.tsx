/**
 * src/features/demo/__tests__/axe.integration.test.tsx — Varredura
 * automatizada de acessibilidade (Task 8.5) sobre a aba Morador da
 * Demo.
 *
 * Renderiza `<DemoMorador>` com `initialDemoState` e roda `axe.run`
 * restringindo o conjunto de regras a `wcag2aa`. Uma única varredura
 * cobre todos os componentes do mockup (`StatusBar`, `AppHeader`,
 * `HighlightBanner`, `AreaCard` × 3, `SlotGrid`, `ConfirmButton`,
 * `ConfirmMessage`, `BottomTabBar`) — eles só precisam estar montados
 * para axe atingi-los.
 *
 * Estado inicial (vs. um estado arbitrário): a suíte de property tests
 * de layout (`DemoMorador.layout.pbt.test.tsx`) já cobre a invariância
 * estrutural contra qualquer sequência de `DemoAction`. Aqui o objetivo
 * é uma checagem de acessibilidade WCAG 2.1 AA estável e determinística
 * — um único render em `initialDemoState` é suficiente para que axe
 * inspecione labels, roles, ARIA, estrutura e contrastes declarativos
 * (via CSS de classe, sem depender de layout real).
 *
 * Sobre jsdom: assim como `src/__tests__/App.integration.test.tsx`,
 * axe-core em jsdom tem falsos-negativos e falsos-positivos em regras
 * dependentes de layout/pintura (color-contrast em particular — jsdom
 * não computa cores efetivas). Se surgirem violações de `color-contrast`
 * neste ambiente, o comentário em `App.integration.test.tsx` documenta
 * a mitigação: filtrar por impacto (`critical`/`serious`). Começamos
 * com a asserção estrita que o design solicita e, se ela falhar por
 * limitações conhecidas de jsdom, ajustamos com um filtro documentado.
 *
 * Stubs de `HTMLDialogElement.showModal`/`close` são necessários porque
 * `DemoMorador` monta `<DialogoFluxoMorador>` (estado fechado por
 * default, mas o componente já referencia a API `<dialog>`).
 *
 * Validates: Requirements 3.6, 5.5, 7.7, 8.4, 10.9, 12.4
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { DemoMorador } from '../DemoMorador';
import { makeFakeDemoHook } from './helpers/makeFakeDemoHook';
import { initialDemoState } from '../types';

beforeAll(() => {
  // `HTMLDialogElement.showModal`/`close` são no-ops em jsdom. O
  // `DialogoFluxoMorador` referencia essas APIs mesmo quando fechado.
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

describe('DemoMorador — acessibilidade (axe-core, wcag2aa)', () => {
  it(
    'não tem violações de acessibilidade WCAG 2.1 AA',
    async () => {
      const { container } = render(
        <DemoMorador demo={makeFakeDemoHook(initialDemoState)} />,
      );

      const results = await axe.run(container, { runOnly: ['wcag2aa'] });

      expect(results.violations).toEqual([]);
    },
    20_000,
  );
});

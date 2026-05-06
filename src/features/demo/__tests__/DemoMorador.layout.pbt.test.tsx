/**
 * src/features/demo/__tests__/DemoMorador.layout.pbt.test.tsx — Testes de
 * propriedade do layout visual do `<DemoMorador>` (Tasks 8.1, 8.2, 8.3).
 *
 * Três propriedades universais sobre sequências arbitrárias de `DemoAction`:
 *
 * - **Property 1 (Task 8.1)** — A moldura do `MobileMockup` é rígida: as
 *   classes responsáveis pela largura, altura e esqueleto do grid de 7
 *   faixas aparecem no DOM em qualquer estado do reducer. Garante que
 *   nenhum caminho de render (área selecionada, slot marcado ou não,
 *   com/sem confirmação) quebra as dimensões fixas do mockup. Valida
 *   simultaneamente todas as alturas declaradas das faixas internas
 *   (`status-bar`, `app-header`, `highlight-banner`, `slot-area`,
 *   `confirm-message-slot`, `bottom-tab-bar`) e do `confirm-button`.
 *
 * - **Property 2 (Task 8.2)** — Os três `AreaCard`s sempre têm a mesma
 *   altura (`h-16`) e sempre há exatamente três deles em `role="radio"`,
 *   independentemente de qual está selecionado ou do estado da Demo.
 *
 * - **Property 3 (Task 8.3)** — Nenhum dos 4 containers decorativos
 *   (`status-bar`, `app-header`, `highlight-banner`, `bottom-tab-bar`)
 *   introduz descendentes focáveis no fluxo de tabulação.
 *
 * Estratégia de teste: partimos de `initialDemoState` e aplicamos a
 * sequência gerada pelo `actionSequenceArb` via `reduce(demoReducer, ...)`.
 * Em seguida renderizamos `<DemoMorador demo={makeFakeDemoHook(finalState)} />`
 * com um `dispatch` no-op (o estado já foi pré-computado, não há eventos
 * de interação a processar no teste). Inspecionamos o DOM final e chamamos
 * `cleanup()` no fim de cada iteração para isolar renders entre runs.
 *
 * O contrato "classe no `className`" é o vínculo determinístico entre o
 * React e o navegador: em jsdom `getBoundingClientRect` retorna zero, mas
 * se as classes Tailwind corretas estão no DOM, o layout real no browser
 * é idêntico ao esperado pelo design.
 */

import { describe, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import { cleanup, render } from '@testing-library/react';
import { DemoMorador } from '../DemoMorador';
import { demoReducer } from '../demoReducer';
import { initialDemoState } from '../types';
import { makeFakeDemoHook } from './helpers/makeFakeDemoHook';
import { actionSequenceArb } from './helpers/demoArbitraries';

// ────────────────────────────────────────────────────────────────────────────
// Feature: demo-morador-mvp-polish, Property 1: Layout invariante do MobileMockup
// Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.4, 4.6, 5.4,
//   7.3, 8.1, 8.2, 9.1, 10.1, 10.6, 13.2, 13.3, 13.4, 13.6
// ────────────────────────────────────────────────────────────────────────────

describe('Property 1 — Layout invariante do MobileMockup', () => {
  test.prop([actionSequenceArb], { numRuns: 100 })(
    'classes de largura, altura e grid permanecem fixas para qualquer estado',
    (actions) => {
      const finalState = actions.reduce(demoReducer, initialDemoState);
      const { container } = render(
        <DemoMorador demo={makeFakeDemoHook(finalState)} />,
      );

      const frame = container.querySelector('[data-demo-frame]');
      expect(frame).not.toBeNull();
      const frameClasses = frame!.className;
      expect(frameClasses).toContain('w-[320px]');
      expect(frameClasses).toContain('h-[640px]');
      expect(frameClasses).toContain(
        'grid-rows-[24px_56px_56px_80px_208px_88px_56px]',
      );

      const statusBar = container.querySelector('[data-testid="status-bar"]');
      expect(statusBar).not.toBeNull();
      expect(statusBar!.className).toContain('h-6');

      for (const testId of [
        'app-header',
        'highlight-banner',
        'bottom-tab-bar',
      ] as const) {
        const el = container.querySelector(`[data-testid="${testId}"]`);
        expect(el).not.toBeNull();
        expect(el!.className).toContain('h-14');
      }

      const slotArea = container.querySelector('[data-testid="slot-area"]');
      expect(slotArea).not.toBeNull();
      expect(slotArea!.className).toContain('h-52');

      const messageSlot = container.querySelector(
        '[data-testid="confirm-message-slot"]',
      );
      expect(messageSlot).not.toBeNull();
      expect(messageSlot!.className).toContain('h-10');

      const confirmButton = container.querySelector(
        '[data-testid="confirm-button"]',
      );
      expect(confirmButton).not.toBeNull();
      expect(confirmButton!.className).toContain('w-full');
      expect(confirmButton!.className).toContain('h-10');

      cleanup();
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Feature: demo-morador-mvp-polish, Property 2: AreaCards compartilham altura constante
// Validates: Requirements 6.3, 6.4
// ────────────────────────────────────────────────────────────────────────────

describe('Property 2 — AreaCards compartilham altura constante', () => {
  test.prop([actionSequenceArb], { numRuns: 100 })(
    'os 3 cards permanecem presentes com classe h-16 em qualquer estado',
    (actions) => {
      const finalState = actions.reduce(demoReducer, initialDemoState);
      const { container } = render(
        <DemoMorador demo={makeFakeDemoHook(finalState)} />,
      );

      const cards = container.querySelectorAll('[role="radio"]');
      expect(cards.length).toBe(3);
      for (const card of Array.from(cards)) {
        expect(card.className).toContain('h-16');
      }

      cleanup();
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Feature: demo-morador-mvp-polish, Property 3: Elementos decorativos fora do fluxo de foco
// Validates: Requirements 10.7, 10.8, 12.7
// ────────────────────────────────────────────────────────────────────────────

describe('Property 3 — Elementos decorativos fora do fluxo de foco', () => {
  const FOCUSABLE =
    'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])';

  test.prop([actionSequenceArb], { numRuns: 100 })(
    'nenhum container decorativo contém descendentes focáveis por teclado',
    (actions) => {
      const finalState = actions.reduce(demoReducer, initialDemoState);
      const { container } = render(
        <DemoMorador demo={makeFakeDemoHook(finalState)} />,
      );

      for (const testId of [
        'status-bar',
        'app-header',
        'highlight-banner',
        'bottom-tab-bar',
      ] as const) {
        const el = container.querySelector(`[data-testid="${testId}"]`);
        expect(el).not.toBeNull();
        expect(el!.querySelectorAll(FOCUSABLE).length).toBe(0);
      }

      cleanup();
    },
  );
});

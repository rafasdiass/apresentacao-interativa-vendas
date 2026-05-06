/**
 * src/features/demo/__tests__/MobileMockup.test.tsx — Smoke test estrutural
 * do componente `MobileMockup` (Task 3.2).
 *
 * Valida que a moldura do mockup mobile expõe o esqueleto esperado por testes
 * de propriedade posteriores (Property 1 em Task 8): `data-testid="mobile-mockup"`
 * e atributo booleano `data-demo-frame` no elemento raiz, todos os slots
 * internos com `data-testid` próprio e os textos decorativos visíveis. Renderiza
 * o componente com placeholders mínimos nos 4 slots nomeados, então a semântica
 * interna de `AreaCard`, `SlotGrid`, `ConfirmButton` e `ConfirmMessage` não é
 * exercida aqui — esses contratos vivem em outros testes. O objetivo é somente
 * garantir que a casca está no lugar e que os elementos puramente decorativos
 * estão fora do fluxo de acessibilidade via `aria-hidden="true"` no elemento
 * raiz.
 *
 * Requirements: 3.5, 4.4, 10.2, 10.7, 11.8
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileMockup } from '../components/MobileMockup';

function renderMockup() {
  return render(
    <MobileMockup
      areaCards={<div data-testid="area-cards-placeholder" />}
      slotArea={<div data-testid="slot-area-placeholder" />}
      confirmButton={
        <button type="button" data-testid="confirm-button-placeholder">
          ok
        </button>
      }
      confirmMessage={null}
    />,
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Moldura raiz
// ────────────────────────────────────────────────────────────────────────────

describe('MobileMockup — moldura raiz', () => {
  it('expõe data-testid="mobile-mockup" e atributo booleano data-demo-frame', () => {
    renderMockup();
    const frame = screen.getByTestId('mobile-mockup');
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveAttribute('data-demo-frame');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Slots internos presentes
// ────────────────────────────────────────────────────────────────────────────

describe('MobileMockup — slots internos', () => {
  it.each([
    ['status-bar'],
    ['app-header'],
    ['highlight-banner'],
    ['slot-area'],
    ['confirm-message-slot'],
    ['bottom-tab-bar'],
  ])('contém o elemento com data-testid="%s"', (testId) => {
    renderMockup();
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Textos decorativos visíveis
// ────────────────────────────────────────────────────────────────────────────

describe('MobileMockup — textos decorativos', () => {
  it('mostra horário fictício "9:41" na status bar', () => {
    renderMockup();
    expect(screen.getByText('9:41')).toBeInTheDocument();
  });

  it('mostra identificação da unidade "CASA 247 · BLOCO B" no header', () => {
    renderMockup();
    expect(screen.getByText('CASA 247 · BLOCO B')).toBeInTheDocument();
  });

  it('mostra saudação "Olá, morador 👋" no header', () => {
    renderMockup();
    expect(screen.getByText('Olá, morador 👋')).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// BottomTabBar — 4 rótulos de navegação
// ────────────────────────────────────────────────────────────────────────────

describe('MobileMockup — BottomTabBar', () => {
  it.each([['Home'], ['Atividades'], ['Avisos'], ['Perfil']])(
    'expõe o rótulo "%s"',
    (label) => {
      renderMockup();
      const tabBar = screen.getByTestId('bottom-tab-bar');
      // `getByText` global pegaria "Avisos" em outros lugares no futuro;
      // restringir o matcher à tab bar mantém o teste estável.
      expect(tabBar).toHaveTextContent(label);
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────
// Acessibilidade dos decorativos — fora do fluxo de leitores de tela
// ────────────────────────────────────────────────────────────────────────────

describe('MobileMockup — containers decorativos com aria-hidden', () => {
  it.each([['status-bar'], ['bottom-tab-bar']])(
    'data-testid="%s" tem aria-hidden="true" no elemento raiz',
    (testId) => {
      renderMockup();
      const el = screen.getByTestId(testId);
      expect(el.getAttribute('aria-hidden')).toBe('true');
    },
  );
});

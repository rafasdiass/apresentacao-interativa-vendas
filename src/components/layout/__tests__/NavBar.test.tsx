/**
 * src/components/layout/__tests__/NavBar.test.tsx — Smoke tests da
 * navegação e do CTA flutuante (Task 9.6).
 *
 * Valida o essencial sem aprofundar em detalhes visuais:
 *
 *   - `NavBar` renderiza todos os itens de `SECOES`.
 *   - O item correspondente ao `activeId` recebe `aria-current="location"`.
 *   - `CTAFloating` renderiza o link `#aceite` quando `visible=true`.
 *   - `CTAFloating` retorna `null` (sem DOM) quando `visible=false`.
 *
 * `IntersectionObserver` é ausente no jsdom — aqui não consumimos o
 * hook `useActiveSection`, mas deixamos um stub global no beforeAll
 * para evitar falhas em casos onde outros componentes da árvore
 * possam registrar observers.
 *
 * Requirements: 1.3, 4.5
 */

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavBar } from '../NavBar';
import { CTAFloating } from '../CTAFloating';
import { SECOES } from '@/data/navegacao';

beforeAll(() => {
  class IO {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal('IntersectionObserver', IO);
});

describe('NavBar', () => {
  it('renderiza todos os itens de SECOES', () => {
    render(<NavBar items={SECOES} activeId="hero" />);
    for (const item of SECOES) {
      // Cada label aparece ao menos uma vez (desktop). Em mobile,
      // o overlay começa fechado, então não há duplicação.
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });

  it('item ativo recebe aria-current="location"', () => {
    render(<NavBar items={SECOES} activeId="demo" />);
    const linkAtivo = screen.getByRole('link', { name: 'Demonstração' });
    expect(linkAtivo).toHaveAttribute('aria-current', 'location');

    // Itens inativos não devem ter aria-current.
    const linkInativo = screen.getByRole('link', { name: 'Início' });
    expect(linkInativo).not.toHaveAttribute('aria-current');
  });
});

describe('CTAFloating', () => {
  it('renderiza link para #aceite quando visible=true', () => {
    render(<CTAFloating visible={true} />);
    const link = screen.getByRole('link', { name: /aceitar proposta/i });
    expect(link.getAttribute('href')).toBe('#aceite');
  });

  it('retorna null quando visible=false', () => {
    const { container } = render(<CTAFloating visible={false} />);
    expect(container.firstChild).toBeNull();
  });
});

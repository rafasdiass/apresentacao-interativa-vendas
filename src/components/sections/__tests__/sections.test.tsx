/**
 * src/components/sections/__tests__/sections.test.tsx — Smoke tests das
 * seções da Apresentacao (Task 8.9).
 *
 * Para cada seção (Hero, Escopo, Cronograma, Investimento, Benchmark,
 * Diferenciais, Aceite) valida três coisas com o mínimo de acoplamento:
 *
 *   1. **Renderização sem crash** via React Testing Library.
 *   2. **`id` correto no DOM** — prova implícita de que a seção pode ser
 *      alvo do scroll-spy da navegação (Property 9, Req. 1.1).
 *   3. **Leitura do `proposta.ts`** — cada seção lê dados autoritativos
 *      do módulo de dados, então checamos a presença de textos
 *      característicos (datas, valores, títulos de diferenciais).
 *
 * Os testes evitam aprofundar em interações (clicks, keyboards): isso já
 * é coberto por `DemoSection.test.tsx` para a Demo e pelos futuros testes
 * do `AceiteForm` (Task 11.5). Aqui o objetivo é detectar regressões
 * amplas — import quebrado, renderização faltando, mudança de `id`.
 *
 * Os polyfills de `HTMLDialogElement.prototype` são os mesmos usados em
 * `DemoSection.test.tsx`: jsdom não implementa `showModal()`/`close()`
 * completamente, e `AceiteSection` + `DiferenciaisSection` montam
 * instâncias do `Modal` (mesmo que fechadas no render inicial).
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.8, 5.1, 5.5
 */

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';
import { EscopoSection } from '../EscopoSection';
import { CronogramaSection } from '../CronogramaSection';
import { InvestimentoSection } from '../InvestimentoSection';
import { BenchmarkSection } from '../BenchmarkSection';
import { DiferenciaisSection } from '../DiferenciaisSection';
import { AceiteSection } from '../AceiteSection';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.removeAttribute('open');
  });
});

describe('Hero', () => {
  it('renderiza com id="hero" e destaca o MVP na Semana 7', () => {
    render(<Hero />);
    expect(document.getElementById('hero')).not.toBeNull();
    expect(screen.getByText(/Semana 7/i)).toBeInTheDocument();
  });
});

describe('EscopoSection', () => {
  it('renderiza com id="escopo" e lista as três áreas comuns', () => {
    render(<EscopoSection />);
    expect(document.getElementById('escopo')).not.toBeNull();
    expect(screen.getByText(/Quadra de Vôlei/i)).toBeInTheDocument();
    expect(screen.getByText(/Piscina/i)).toBeInTheDocument();
    expect(screen.getByText(/Deck e Salão/i)).toBeInTheDocument();
  });
});

describe('CronogramaSection', () => {
  it('renderiza com id="cronograma" e expõe as 4 fases × 10 semanas', () => {
    render(<CronogramaSection />);
    expect(document.getElementById('cronograma')).not.toBeNull();
    expect(screen.getByText('Fase 1')).toBeInTheDocument();
    expect(screen.getByText('Fase 4')).toBeInTheDocument();
    expect(screen.getByText(/Semanas 1–2/)).toBeInTheDocument();
    expect(screen.getByText(/Semanas 9–10/)).toBeInTheDocument();
  });
});

describe('InvestimentoSection', () => {
  it('renderiza com id="investimento" e formata os valores em pt-BR', () => {
    render(<InvestimentoSection />);
    expect(document.getElementById('investimento')).not.toBeNull();
    expect(screen.getByText('R$ 33.500,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 15.000,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 18.500,00')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('R$ 1.150,00')),
    ).toBeInTheDocument();
  });
});

describe('BenchmarkSection', () => {
  it('renderiza com id="benchmarking" e destaca a linha da Lavita Code', () => {
    render(<BenchmarkSection />);
    expect(document.getElementById('benchmarking')).not.toBeNull();
    expect(
      screen.getByText('Esta proposta (Lavita Code)'),
    ).toBeInTheDocument();
  });
});

describe('DiferenciaisSection', () => {
  it('renderiza com id="diferenciais" e expõe diferenciais-chave', () => {
    render(<DiferenciaisSection />);
    expect(document.getElementById('diferenciais')).not.toBeNull();
    expect(screen.getByText(/Automação total/i)).toBeInTheDocument();
    // "MVP em uso real a partir da Semana 7" aparece no corpo do diferencial
    // de lançamento gradual; basta o fragmento "Semana 7".
    expect(screen.getByText(/Semana 7/)).toBeInTheDocument();
  });
});

describe('AceiteSection', () => {
  it('renderiza com id="aceite" e expõe os três CTAs', () => {
    render(<AceiteSection />);
    expect(document.getElementById('aceite')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: /Aceitar proposta/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Falar no WhatsApp/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Baixar PDF da proposta/i }),
    ).toBeInTheDocument();
  });
});

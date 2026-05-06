/**
 * src/features/demo/__tests__/DemoSection.test.tsx — Testes RTL
 * integrados da seção Demo (Task 7.12).
 *
 * Renderizar `<DemoSection />` exercita, de uma vez, o trio
 * `DemoSection` + `DemoMorador` + `DemoTabs` amarrados pela instância
 * única de `useDemoReservas`, que é exatamente a topologia usada em
 * produção (Task 7.11). Isso evita mocks do hook e testa o contrato
 * real dos componentes.
 *
 * Requirements: 3.2, 3.5, 3.6, 3.7
 */

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemoSection } from '../DemoSection';

// `<dialog>` em jsdom tem implementação incompleta (`showModal`/`close`
// lançam em versões atuais). Nenhum teste aqui abre o modal de fluxo
// Morador, mas o componente `DialogoFluxoMorador` é montado com
// `open={false}` e isso pode, em alguns caminhos do Modal, disparar
// `close()`. Mockamos de forma não invasiva, alinhando o comportamento
// do browser: `showModal()` adiciona o atributo `open`, `close()` o
// remove.
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

// ────────────────────────────────────────────────────────────────────────────
// Renderização inicial
// ────────────────────────────────────────────────────────────────────────────

describe('DemoSection — renderização inicial', () => {
  it('renderiza seção com id="demo"', () => {
    render(<DemoSection />);
    expect(document.getElementById('demo')).not.toBeNull();
  });

  it('inicia na aba "Visão do Morador" com aria-selected="true"', () => {
    render(<DemoSection />);
    const moradorTab = screen.getByRole('tab', { name: /visão do morador/i });
    const sindicoTab = screen.getByRole('tab', { name: /painel do síndico/i });
    expect(moradorTab).toHaveAttribute('aria-selected', 'true');
    expect(sindicoTab).toHaveAttribute('aria-selected', 'false');
  });

  it('mostra o MobileMockup com header "CASA 247 · BLOCO B"', () => {
    render(<DemoSection />);
    expect(screen.getByText('CASA 247 · BLOCO B')).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// DemoTabs — interação
// ────────────────────────────────────────────────────────────────────────────

describe('DemoTabs — interação', () => {
  it('clicar na tab "Painel do Síndico" muda para o painel do Síndico', async () => {
    const user = userEvent.setup();
    render(<DemoSection />);

    const sindTab = screen.getByRole('tab', { name: /painel do síndico/i });
    await user.click(sindTab);

    expect(sindTab).toHaveAttribute('aria-selected', 'true');
    // KPIs do painel do Síndico ficam visíveis após a troca.
    expect(screen.getByText('Reservas hoje')).toBeInTheDocument();
    expect(screen.getByText('Casas ativas')).toBeInTheDocument();
  });

  it('setas do teclado alternam entre tabs', async () => {
    const user = userEvent.setup();
    render(<DemoSection />);

    const moradorTab = screen.getByRole('tab', { name: /visão do morador/i });
    moradorTab.focus();

    await user.keyboard('{ArrowRight}');
    expect(
      screen.getByRole('tab', { name: /painel do síndico/i }),
    ).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(moradorTab).toHaveAttribute('aria-selected', 'true');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// DemoMorador — fluxo de reserva
// ────────────────────────────────────────────────────────────────────────────

describe('DemoMorador — fluxo de reserva', () => {
  it('selecionar slot livre habilita o botão de confirmação', async () => {
    const user = userEvent.setup();
    render(<DemoSection />);

    // Seed inicial ocupa 10:00, 14:00, 15:00 e 20:00 na Quadra, então
    // 09:00 é livre e 09:00 + 2h = 11:00 ≤ fechamento 22:00.
    const slot09 = screen.getByRole('button', { name: '09:00' });
    await user.click(slot09);

    const confirmBtn = screen.getByRole('button', {
      name: /Reservar 09:00 – 11:00/i,
    });
    expect(confirmBtn).toBeEnabled();
  });

  it('confirmar uma reserva marca o slot como ocupado (disabled + line-through)', async () => {
    const user = userEvent.setup();
    render(<DemoSection />);

    await user.click(screen.getByRole('button', { name: '09:00' }));
    await user.click(
      screen.getByRole('button', { name: /Reservar 09:00 – 11:00/i }),
    );

    // Após CONFIRM, 09:00 passa a ser renderizado com o aria-label de
    // slot ocupado (mesma regra que aplica ao seed inicial de 10:00).
    const slot09After = screen.getByRole('button', {
      name: /09:00 — ocupado/i,
    });
    expect(slot09After).toBeDisabled();

    // E a ConfirmMessage aparece num live region acessível.
    expect(screen.getByRole('status')).toHaveTextContent(
      /Reserva confirmada.*09:00.*11:00/,
    );
  });

  it('slot 10:00 do seed aparece como ocupado', () => {
    render(<DemoSection />);
    expect(
      screen.getByRole('button', { name: /10:00 — ocupado/i }),
    ).toBeDisabled();
  });

  it('slot 21:00 aparece como fora do horário', () => {
    // 21:00 + 2h = 23:00 > fechamento 22:00 → 'fora-do-expediente'.
    // Corrige o Bug #6 do HTML original (Property 5).
    render(<DemoSection />);
    expect(
      screen.getByRole('button', { name: /21:00 — fora do horário/i }),
    ).toBeDisabled();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// DemoMorador — Piscina informativa
// ────────────────────────────────────────────────────────────────────────────

describe('DemoMorador — Piscina informativa', () => {
  it('selecionar Piscina esconde a grade e mostra a mensagem informativa', async () => {
    const user = userEvent.setup();
    render(<DemoSection />);

    const piscinaCard = screen.getByRole('radio', { name: /piscina/i });
    await user.click(piscinaCard);

    expect(piscinaCard).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByText(/informativa — não aceita reservas via app/i),
    ).toBeInTheDocument();
  });
});

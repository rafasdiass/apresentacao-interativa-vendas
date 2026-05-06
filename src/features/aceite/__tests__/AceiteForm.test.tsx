/**
 * src/features/aceite/__tests__/AceiteForm.test.tsx — Testes RTL do
 * formulário de aceite (Task 11.5).
 *
 * Estratégia: montar `<AceiteForm />` diretamente, sem o shell da
 * `AceiteSection`, e exercer os três cenários-chave descritos no design
 * (válido, inválido, erro de rede) via `userEvent` v14 e `vi.stubGlobal`
 * para `fetch` — jsdom não tem `fetch` por padrão.
 *
 * O endpoint usado nos testes é arbitrário (`/__mock__/aceite`) porque o
 * componente recebe o endpoint como prop e não lê a env var diretamente.
 * Isso evita qualquer necessidade de `vi.stubEnv`.
 *
 * Requirements: 6.2, 6.3, 6.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AceiteForm } from '../AceiteForm';

const ENDPOINT = '/__mock__/aceite';

// Dados válidos usados pelos cenários de sucesso e erro de rede.
const dadosValidos = {
  nome: 'Maria da Silva Souza',
  documento: '123.456.789-00',
  email: 'maria@example.com',
  telefone: '(85) 98765-4321',
} as const;

/**
 * Preenche os quatro campos de texto + marca o checkbox de aceite.
 * Centraliza o ritual repetitivo dos testes de submissão.
 */
async function preencherFormularioValido(
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> {
  await user.type(screen.getByLabelText(/nome completo/i), dadosValidos.nome);
  await user.type(
    screen.getByLabelText(/cpf ou cnpj/i),
    dadosValidos.documento,
  );
  await user.type(screen.getByLabelText(/e-mail/i), dadosValidos.email);
  await user.type(screen.getByLabelText(/telefone/i), dadosValidos.telefone);
  await user.click(screen.getByRole('checkbox'));
}

beforeEach(() => {
  // Cada teste reseta o mock de fetch para evitar vazamento entre casos.
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// 1. Renderização
// ────────────────────────────────────────────────────────────────────────────

describe('AceiteForm — renderização', () => {
  it('renderiza todos os campos e o botão de aceite', () => {
    render(<AceiteForm endpoint={ENDPOINT} />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf ou cnpj/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /registrar aceite/i }),
    ).toBeInTheDocument();
  });

  it('referencia a Lavita Code no texto de aceite', () => {
    render(<AceiteForm endpoint={ENDPOINT} />);
    expect(screen.getByText(/Lavita Code/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Validação
// ────────────────────────────────────────────────────────────────────────────

describe('AceiteForm — validação', () => {
  it('submissão com campos vazios mostra erros por campo e marca aria-invalid', async () => {
    const user = userEvent.setup();
    render(<AceiteForm endpoint={ENDPOINT} />);

    await user.click(
      screen.getByRole('button', { name: /registrar aceite/i }),
    );

    // Cada mensagem de erro vem do schema zod definido em 11.1.
    expect(
      await screen.findByText(/nome precisa ter pelo menos 3 caracteres/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/informe um cpf ou cnpj válido/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/informe um e-mail válido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/informe um telefone brasileiro válido/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/é necessário aceitar os termos da proposta/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/nome completo/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText(/cpf ou cnpj/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    // fetch não é chamado quando a validação falha.
    expect(fetch).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Submissão bem-sucedida
// ────────────────────────────────────────────────────────────────────────────

describe('AceiteForm — submissão bem-sucedida', () => {
  it('submissão com dados válidos chama fetch no endpoint com JSON correto', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<AceiteForm endpoint={ENDPOINT} />);
    await preencherFormularioValido(user);
    await user.click(
      screen.getByRole('button', { name: /registrar aceite/i }),
    );

    // Aguarda a UI de sucesso para garantir que o fluxo assíncrono concluiu.
    await screen.findByText(/aceite registrado em/i);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const call = mockFetch.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call as [string, RequestInit];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers.Accept).toBe('application/json');

    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.nome).toBe(dadosValidos.nome);
    expect(body.documento).toBe(dadosValidos.documento);
    expect(body.email).toBe(dadosValidos.email);
    expect(body.telefone).toBe(dadosValidos.telefone);
    expect(body.aceitouTermos).toBe(true);
  });

  it('sucesso exibe banner de confirmação com data em pt-BR', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<AceiteForm endpoint={ENDPOINT} />);
    await preencherFormularioValido(user);
    await user.click(
      screen.getByRole('button', { name: /registrar aceite/i }),
    );

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent(/aceite registrado em/i);
    expect(banner).toHaveTextContent(/Lavita Code/i);
  });

  it('onSuccess callback é chamado com os dados validados', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<AceiteForm endpoint={ENDPOINT} onSuccess={onSuccess} />);
    await preencherFormularioValido(user);
    await user.click(
      screen.getByRole('button', { name: /registrar aceite/i }),
    );

    await screen.findByText(/aceite registrado em/i);

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({
      nome: dadosValidos.nome,
      documento: dadosValidos.documento,
      email: dadosValidos.email,
      telefone: dadosValidos.telefone,
      aceitouTermos: true,
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Erro de rede
// ────────────────────────────────────────────────────────────────────────────

describe('AceiteForm — erro de rede', () => {
  it('exibe banner de erro e preserva os dados digitados', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockRejectedValue(new Error('network'));

    render(<AceiteForm endpoint={ENDPOINT} />);
    await preencherFormularioValido(user);
    await user.click(
      screen.getByRole('button', { name: /registrar aceite/i }),
    );

    // Banner de erro com role="alert" e CTAs de recuperação.
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/não foi possível enviar o aceite/i);
    expect(
      screen.getByRole('button', { name: /tentar novamente/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /falar no whatsapp/i }),
    ).toBeInTheDocument();

    // Dados permanecem no form (Req. 6.3).
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue(
      dadosValidos.nome,
    );
    expect(screen.getByLabelText(/cpf ou cnpj/i)).toHaveValue(
      dadosValidos.documento,
    );
    expect(screen.getByLabelText(/e-mail/i)).toHaveValue(dadosValidos.email);
    expect(screen.getByLabelText(/telefone/i)).toHaveValue(
      dadosValidos.telefone,
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

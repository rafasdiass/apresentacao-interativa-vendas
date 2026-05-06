/**
 * src/features/presenter/__tests__/PresenterContext.test.tsx —
 * Testes RTL do Modo Apresentador (Task 10.4).
 *
 * A ativação do Modo Apresentador é derivada **exclusivamente** da
 * query string `?modo=apresentador` (Req. 7.1 / 7.5). O
 * `PresenterProvider` lê `window.location.search` apenas no mount,
 * então cada teste precisa preparar `location.search` **antes** de
 * renderizar. Usamos um helper que substitui o objeto `window.location`
 * inteiro — `jsdom` não permite mutar a `search` diretamente, mas
 * permite redefinir `window.location` como property descriptor.
 *
 * Escopo dos casos:
 *
 *   1. `active === true` quando a query contém `?modo=apresentador`.
 *   2. `active === false` quando a query está ausente.
 *   3. `PresenterControls` renderiza um `<aside>` com
 *      `role="region"` nomeado quando ativo.
 *   4. `PresenterControls` retorna `null` quando inativo — o container
 *      da RTL fica vazio.
 *   5. O botão "Copiar link" chama `navigator.clipboard.writeText` com
 *      o `location.href` atual (Req. 7.4).
 *
 * Requirements: 7.1, 7.2, 7.3, 7.5
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  PresenterProvider,
  usePresenter,
} from '../PresenterContext';
import { PresenterControls } from '../PresenterControls';

// ────────────────────────────────────────────────────────────────────────────
// Helpers de stubbing de `window.location`
// ────────────────────────────────────────────────────────────────────────────

const originalLocation = window.location;

/**
 * Substitui `window.location` por um objeto mutável com a `search`
 * desejada. `delete (window as any).location` destrava a propriedade
 * read-only definida por jsdom; em seguida atribuímos um novo objeto
 * copiando campos relevantes do original para manter `href`, `origin`,
 * etc. funcionando minimamente.
 */
function setLocationSearch(search: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).location;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).location = {
    ...originalLocation,
    search,
    href: `http://localhost/${search}`,
  };
}

afterEach(() => {
  // Restaura a `location` original para não vazar entre testes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).location;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).location = originalLocation;
});

// Pequeno componente-sonda que expõe o valor de `usePresenter` no DOM
// para que os testes possam asseverar via texto simples.
function Probe(): JSX.Element {
  const presenter = usePresenter();
  return <span data-testid="active">{String(presenter.active)}</span>;
}

// ────────────────────────────────────────────────────────────────────────────
// PresenterProvider — detecção do modo via query string
// ────────────────────────────────────────────────────────────────────────────

describe('PresenterProvider — detecção do modo', () => {
  it('ativa quando a URL contém ?modo=apresentador', () => {
    setLocationSearch('?modo=apresentador');
    render(
      <PresenterProvider>
        <Probe />
      </PresenterProvider>,
    );
    expect(screen.getByTestId('active')).toHaveTextContent('true');
  });

  it('permanece inativo sem o parâmetro modo', () => {
    setLocationSearch('');
    render(
      <PresenterProvider>
        <Probe />
      </PresenterProvider>,
    );
    expect(screen.getByTestId('active')).toHaveTextContent('false');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// PresenterControls — renderização condicional
// ────────────────────────────────────────────────────────────────────────────

describe('PresenterControls — renderização condicional', () => {
  it('renderiza o painel de controles quando o modo está ativo', () => {
    setLocationSearch('?modo=apresentador');
    render(
      <PresenterProvider>
        <PresenterControls />
      </PresenterProvider>,
    );
    expect(
      screen.getByRole('region', {
        name: /controles do modo apresentador/i,
      }),
    ).toBeInTheDocument();
  });

  it('retorna null quando o modo está inativo', () => {
    setLocationSearch('');
    const { container } = render(
      <PresenterProvider>
        <PresenterControls />
      </PresenterProvider>,
    );
    // `firstChild` é null quando o componente não renderiza nada.
    expect(container.firstChild).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// copyShareLink — integração com a Clipboard API
// ────────────────────────────────────────────────────────────────────────────

describe('copyShareLink — Clipboard API', () => {
  it('chama navigator.clipboard.writeText ao clicar em "Copiar link"', async () => {
    setLocationSearch('?modo=apresentador');

    // `userEvent.setup()` instala seu próprio stub de `navigator.clipboard`
    // com `writeToClipboard: true`. Precisamos instalar nosso spy **depois**
    // da chamada a `setup()` para que o mock não seja sobrescrito.
    const user = userEvent.setup();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <PresenterProvider>
        <PresenterControls />
      </PresenterProvider>,
    );

    await user.click(screen.getByRole('button', { name: /copiar link/i }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });
});

/**
 * src/features/demo/components/AppHeader.tsx — Cabeçalho decorativo do MobileMockup.
 *
 * Reproduz o visual de um app header mobile com avatar circular, saudação em
 * duas linhas (identificação da unidade + "Olá, morador") e um sino de
 * notificações com badge. Todo o conteúdo é estático — não há interação — e os
 * elementos puramente gráficos (avatar e badge) são marcados `aria-hidden="true"`
 * para não poluir o leitor de tela. Altura fixa `h-14` (56px) ancora a segunda
 * faixa do grid do `MobileMockup`.
 *
 * O texto `CASA 247 · BLOCO B` é preservado byte-a-byte para manter
 * compatibilidade com os testes existentes em `DemoSection.test.tsx`.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import { BellIcon } from './icons/BellIcon';

export function AppHeader(): JSX.Element {
  return (
    <header
      data-testid="app-header"
      className="flex h-14 items-center justify-between border-b border-white/10 bg-surface-dark px-4 text-text-on-dark"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center text-text-on-dark font-bold"
        >
          M
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider opacity-70">
            CASA 247 · BLOCO B
          </span>
          <span className="text-sm font-medium">Olá, morador 👋</span>
        </div>
      </div>
      <div className="relative">
        <BellIcon className="w-6 h-6" />
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-status-negative text-[10px] text-white flex items-center justify-center"
        >
          3
        </span>
      </div>
    </header>
  );
}

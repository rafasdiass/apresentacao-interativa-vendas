/**
 * src/features/presenter/PresenterControls.tsx — Painel flutuante do
 * Modo Apresentador (Task 10.3).
 *
 * Renderiza um `<aside>` fixo no canto inferior esquerdo com:
 *
 *   1. O rótulo `Modo Apresentador` para identificação inequívoca no
 *      telão (Req. 7.2).
 *   2. Indicador de progresso `N / total — Rótulo da seção atual`, que
 *      dá ao Vendedor o contexto do "onde estou" sem precisar olhar
 *      para a navegação principal (Req. 7.2).
 *   3. Notas do apresentador da seção atual, lidas diretamente do item
 *      correspondente de `SECOES` (Req. 7.3). Renderizamos as notas
 *      **no próprio painel de controle** em vez de "abaixo de cada
 *      seção": isso mantém as notas sempre visíveis ao Vendedor,
 *      inclusive quando ele está guiando o cliente por uma seção mas
 *      precisa lembrar os pontos a enfatizar.
 *   4. Botões de navegação anterior/próxima e **Copiar link** (Req.
 *      7.4). O botão de cópia confirma visualmente com
 *      "Copiado!" por 2 s antes de voltar ao estado idle.
 *
 * O componente retorna `null` quando `presenter.active === false`
 * (Req. 7.5) — ou seja, ele é totalmente opt-in via query string. Isso
 * mantém o modo Cliente pixel-idêntico ao que veria sem o painel.
 *
 * Acessibilidade: `role="region"` + `aria-label` dá a leitores de tela
 * um landmark nomeado; cada botão interativo tem `type="button"`
 * explícito para evitar submissão acidental caso um dia o painel seja
 * aninhado num `<form>`.
 *
 * Requirements: 7.2, 7.3, 7.4, 7.5
 */

import { useState } from 'react';
import { SECOES } from '@/data/navegacao';
import { usePresenter } from './PresenterContext';

/**
 * Estados do feedback de cópia do link. Mantemos `error` como estado
 * explícito para caso a Clipboard API rejeite (ex.: sem foco na aba,
 * sem permissão) — nesse caso o texto do botão reflete o erro em vez
 * de silenciar.
 */
type CopyStatus = 'idle' | 'copied' | 'error';

export function PresenterControls(): JSX.Element | null {
  const presenter = usePresenter();
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  if (!presenter.active) return null;

  const currentSection = SECOES[presenter.currentSectionIndex];

  const handleCopy = async (): Promise<void> => {
    try {
      await presenter.copyShareLink();
      setCopyStatus('copied');
      // Volta ao estado idle após 2 s para que o Vendedor saiba que
      // pode copiar de novo se precisar.
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <aside
      role="region"
      aria-label="Controles do Modo Apresentador"
      className="fixed bottom-4 left-4 z-50 w-72 rounded-md border border-accent-primary bg-bg-primary p-3 text-sm shadow-2xl"
    >
      <p className="text-xs uppercase tracking-wider text-accent-primary">
        Modo Apresentador
      </p>
      <p className="mt-1 text-text-primary font-semibold">
        {presenter.currentSectionIndex + 1} / {SECOES.length} —{' '}
        {currentSection?.label ?? ''}
      </p>
      {currentSection?.notasApresentador && (
        <p className="mt-2 text-xs text-text-secondary">
          {currentSection.notasApresentador}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() =>
            presenter.goToSection(presenter.currentSectionIndex - 1)
          }
          className="rounded-md border border-border-primary px-2 py-1 text-xs hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={() =>
            presenter.goToSection(presenter.currentSectionIndex + 1)
          }
          className="rounded-md border border-border-primary px-2 py-1 text-xs hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          Próxima →
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="ml-auto rounded-md bg-accent-primary px-2 py-1 text-xs font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          {copyStatus === 'copied'
            ? 'Copiado!'
            : copyStatus === 'error'
              ? 'Erro'
              : 'Copiar link'}
        </button>
      </div>
    </aside>
  );
}

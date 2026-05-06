/**
 * src/features/demo/components/sindico/AcoesRapidas.tsx — Ações rápidas
 * do Síndico, como cards clicáveis que abrem um `TooltipFeature` (modal
 * informativo) com a descrição da funcionalidade.
 *
 * Substitui os botões `onclick="sendPrompt(...)"` do HTML original
 * (Bug #1: função indefinida) por uma interação acessível e
 * determinística: cada card é um `<button>` que invoca um modal
 * explicativo sem alterar o estado da Demo. Isso cumpre o Req. 3.12
 * ("WHEN o Cliente clica em uma ação rápida do Síndico, THE Sistema
 * SHALL abrir um modal ou tooltip explicando a funcionalidade").
 *
 * A fonte de dados é {@link ACOES_RAPIDAS_SINDICO} (Task 3.1), que
 * contém título e descrição de cada ação.
 *
 * Requirements: 3.12, 10.6, 11.5
 */

import { TooltipFeature } from '@/components/ui/TooltipFeature';
import { ACOES_RAPIDAS_SINDICO } from '@/data/demoConfig';

export function AcoesRapidas(): JSX.Element {
  return (
    <section className="rounded-md border border-border-primary bg-bg-secondary p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        Ações rápidas
      </h3>
      <div className="flex flex-col gap-2">
        {ACOES_RAPIDAS_SINDICO.map((acao) => (
          <TooltipFeature
            key={acao.titulo}
            titulo={acao.titulo}
            descricao={acao.descricao}
            className="rounded-md border border-border-primary px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
          >
            {acao.titulo} →
          </TooltipFeature>
        ))}
      </div>
    </section>
  );
}

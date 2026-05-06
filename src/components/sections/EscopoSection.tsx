/**
 * src/components/sections/EscopoSection.tsx — Seção "Escopo".
 *
 * Renderiza as três áreas comuns cobertas pelo app (Quadra de Vôlei,
 * Piscina, Deck e Salão) em formato de tabela comparativa. Dados vêm
 * de `proposta.escopo` (Task 2.1).
 *
 * A tabela é envelopada em `overflow-x-auto` para permitir rolagem
 * horizontal em viewports estreitos sem quebrar o layout das células.
 *
 * Requirements: 2.2, 10.3
 */

import { proposta } from '@/data/proposta';

export function EscopoSection(): JSX.Element {
  return (
    <section
      id="escopo"
      aria-labelledby="escopo-titulo"
      className="bg-bg-secondary px-4 py-16"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            Escopo
          </p>
          <h2
            id="escopo-titulo"
            className="mt-1 font-heading text-3xl font-bold text-text-primary"
          >
            Áreas comuns cobertas pelo app
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Três áreas com regras de negócio diferentes, totalmente
            automatizadas. O app conhece os horários, os limites e as regras
            de cada espaço — zero intervenção manual do síndico.
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="border border-border-primary bg-bg-primary px-4 py-3 font-semibold text-text-primary">
                  Área
                </th>
                <th className="border border-border-primary bg-bg-primary px-4 py-3 font-semibold text-text-primary">
                  Dias úteis
                </th>
                <th className="border border-border-primary bg-bg-primary px-4 py-3 font-semibold text-text-primary">
                  Fim de semana
                </th>
                <th className="border border-border-primary bg-bg-primary px-4 py-3 font-semibold text-text-primary">
                  Regra principal
                </th>
              </tr>
            </thead>
            <tbody>
              {proposta.escopo.map((area) => (
                <tr key={area.nome}>
                  <td className="border border-border-primary bg-bg-primary px-4 py-3 font-semibold text-text-primary">
                    {area.nome}
                  </td>
                  <td className="border border-border-primary bg-bg-primary px-4 py-3 text-text-secondary">
                    {area.horarioDiaUtil}
                  </td>
                  <td className="border border-border-primary bg-bg-primary px-4 py-3 text-text-secondary">
                    {area.horarioFimDeSemana}
                  </td>
                  <td className="border border-border-primary bg-bg-primary px-4 py-3 text-text-secondary">
                    {area.regraPrincipal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

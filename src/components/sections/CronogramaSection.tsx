/**
 * src/components/sections/CronogramaSection.tsx — Seção "Cronograma".
 *
 * Renderiza as 4 fases × 10 semanas do projeto como um grid de cards
 * responsivo (1 col mobile, 2 cols md, 4 cols lg). Cada card traz o
 * número da fase em destaque, intervalo de semanas, lista de atividades
 * e um bloco destacando o entregável.
 *
 * Dados vêm de `proposta.cronograma` (Task 2.1). A Fase 3 (MVP em uso
 * real, Semanas 7–8) recebe destaque visual extra nos componentes
 * adjacentes (Hero, Diferenciais) — aqui apenas renderizamos o
 * conteúdo bruto, sem grifo diferenciado, para manter a paridade
 * visual entre as 4 fases.
 *
 * Requirements: 2.3, 10.3
 */

import { proposta } from '@/data/proposta';

export function CronogramaSection(): JSX.Element {
  return (
    <section
      id="cronograma"
      aria-labelledby="cronograma-titulo"
      className="bg-bg-primary px-4 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            Cronograma
          </p>
          <h2
            id="cronograma-titulo"
            className="mt-1 font-heading text-3xl font-bold text-text-primary"
          >
            4 fases × 10 semanas
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {proposta.cronograma.map((fase) => (
            <article
              key={fase.fase}
              className="flex flex-col rounded-md border border-border-primary bg-bg-secondary p-4"
            >
              <header className="mb-3 flex items-baseline gap-2">
                <span className="font-heading text-3xl font-bold text-accent-primary">
                  {`Fase ${fase.fase}`}
                </span>
                <span className="text-xs uppercase tracking-wider text-text-tertiary">
                  {`Semanas ${fase.semanas}`}
                </span>
              </header>

              <ul className="mb-3 flex-1 space-y-1.5 text-sm text-text-secondary">
                {fase.atividades.map((atividade) => (
                  <li key={atividade} className="flex gap-2">
                    <span aria-hidden="true" className="text-accent-primary">
                      ·
                    </span>
                    <span>{atividade}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-sm bg-bg-tertiary px-3 py-2 text-xs text-text-primary">
                <span className="font-semibold">Entregável:</span>{' '}
                {fase.entregaveis.join(', ')}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

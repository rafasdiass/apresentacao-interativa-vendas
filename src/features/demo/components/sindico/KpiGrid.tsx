/**
 * src/features/demo/components/sindico/KpiGrid.tsx — KPIs do painel do
 * Síndico.
 *
 * Renderiza os 4 indicadores numéricos declarados em
 * {@link KPIS_SINDICO} (Task 3.1) em um grid responsivo (2 colunas em
 * mobile, 4 em `sm+`). Cada card exibe rótulo pequeno, valor de
 * destaque e, se presente, um delta contextual colorido conforme o
 * tom semântico (`'positivo'` em verde de marca, `'neutro'` em
 * secundário).
 *
 * Puramente estático — nenhuma prop, nenhum estado. A tipagem rica
 * da fonte de dados (`tom: 'positivo' | 'neutro'`) vem garantida de
 * `demoConfig.ts` e é simplesmente refletida nos estilos.
 *
 * Requirements: 3.11, 11.2
 */

import { KPIS_SINDICO } from '@/data/demoConfig';

export function KpiGrid(): JSX.Element {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {KPIS_SINDICO.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-md border border-border-primary bg-bg-secondary p-3"
        >
          <dt className="text-xs text-text-secondary">{kpi.label}</dt>
          <dd className="mt-1 text-2xl font-bold text-text-primary">
            {kpi.valor}
          </dd>
          {kpi.delta && (
            <p
              className={`mt-1 text-xs ${
                kpi.tom === 'positivo'
                  ? 'text-accent-primary'
                  : 'text-text-secondary'
              }`}
            >
              {kpi.delta}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}

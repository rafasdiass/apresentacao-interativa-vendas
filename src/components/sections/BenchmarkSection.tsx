/**
 * src/components/sections/BenchmarkSection.tsx — Seção "Benchmark".
 *
 * Renderiza a tabela comparativa de `BENCHMARK` (Task 3.2) posicionando
 * a Proposta da Lavita Code frente a SaaS white-label, dev customizado Sudeste
 * e concorrente regional. A linha "Esta proposta (Lavita Code)" é marcada com
 * `aria-current="true"` e destaque visual (fundo accent com opacidade),
 * permitindo leitores de tela identificar a opção "corrente".
 *
 * Abaixo da tabela, um `<footer>` com as notas de `FONTES_BENCHMARK`
 * cumpre o Req. 5.3 — citar as bases das faixas apresentadas.
 *
 * A subseção "Por que sob medida" (Req. 5.5) fecha o argumento com 3
 * bullets que justificam a escolha de desenvolvimento dedicado sobre
 * SaaS genérico: propriedade do código, regras específicas do condomínio
 * e custo-benefício Fortaleza × Sudeste.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { BENCHMARK, FONTES_BENCHMARK } from '@/data/benchmark';

export function BenchmarkSection(): JSX.Element {
  return (
    <section
      id="benchmarking"
      aria-labelledby="benchmarking-titulo"
      className="bg-bg-primary px-4 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            Benchmark
          </p>
          <h2
            id="benchmarking-titulo"
            className="mt-1 font-heading text-3xl font-bold text-text-primary"
          >
            Como essa proposta se posiciona
          </h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Opção
                </th>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Custo inicial
                </th>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Mensalidade
                </th>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Prazo
                </th>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Propriedade
                </th>
                <th className="border border-border-primary bg-bg-secondary px-4 py-3 font-semibold text-text-primary">
                  Customização
                </th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARK.map((linha) => {
                const ehProposta = linha.opcao === 'Esta proposta (Lavita Code)';
                const rowClass = ehProposta
                  ? 'bg-accent-primary/10 text-text-primary font-semibold'
                  : 'bg-bg-primary text-text-secondary';
                return (
                  <tr
                    key={linha.opcao}
                    {...(ehProposta ? { 'aria-current': 'true' as const } : {})}
                    className={rowClass}
                  >
                    <td className="border border-border-primary px-4 py-3">
                      {linha.opcao}
                    </td>
                    <td className="border border-border-primary px-4 py-3 tabular-nums">
                      {linha.custoInicial}
                    </td>
                    <td className="border border-border-primary px-4 py-3 tabular-nums">
                      {linha.custoMensal}
                    </td>
                    <td className="border border-border-primary px-4 py-3">
                      {linha.prazoEntrega}
                    </td>
                    <td className="border border-border-primary px-4 py-3">
                      {linha.propriedadeCodigo}
                    </td>
                    <td className="border border-border-primary px-4 py-3">
                      {linha.customizacao}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="mt-4 border-t border-border-primary pt-3">
          <ol className="space-y-1 text-xs text-text-tertiary">
            {FONTES_BENCHMARK.map((fonte, i) => (
              <li key={fonte}>
                <span className="mr-1 font-medium">{i + 1}.</span>
                {fonte}
              </li>
            ))}
          </ol>
        </footer>

        <section aria-labelledby="sob-medida-titulo" className="space-y-3">
          <h3
            id="sob-medida-titulo"
            className="font-heading text-xl font-semibold text-text-primary"
          >
            Por que sob medida
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                <strong className="text-text-primary">
                  Propriedade do código:
                </strong>{' '}
                nenhum vendor lock-in. Você pode trocar de fornecedor ou
                tornar o app interno.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                <strong className="text-text-primary">
                  Regras de negócio específicas:
                </strong>{' '}
                limite de 2h na quadra, piscina informativa com janelas
                particulares por dia da semana, e lançamento gradual — coisas
                que SaaS white-label não suporta sem customização paga.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                <strong className="text-text-primary">
                  Economia frente ao Sudeste:
                </strong>{' '}
                mesmo escopo, entrega por dev sênior em Fortaleza.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}

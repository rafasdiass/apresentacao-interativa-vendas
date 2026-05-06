/**
 * src/components/sections/InvestimentoSection.tsx — Seção "Investimento".
 *
 * Renderiza a tabela de itens do desenvolvimento (R$ 15.000 + R$ 18.500 =
 * R$ 33.500), o bloco de mensalidade (R$ 1.150/mês) com itens inclusos,
 * as condições de pagamento (entrada 50% / saldo 50%, garantia 90 dias) e
 * a `ValidadeBadge` alinhada no topo à direita para criar urgência
 * discreta (Req. 4.8).
 *
 * Todos os valores monetários saem formatados por `formatarMoeda` (pt-BR,
 * prefixo `R$ `, separador de milhares `.`, decimal `,`). A Task 2.3
 * (`validarProposta`) garante em build-time que a soma dos itens bate
 * com `totalCentavos` — não precisamos revalidar aqui no render.
 *
 * As porcentagens de entrada/saldo são derivadas multiplicando
 * `totalCentavos` por `entradaPct/100` e `saldoPct/100`. A Property 1 de
 * validação assegura que `entradaPct + saldoPct === 100`, então a soma
 * desses dois valores é sempre igual a `totalCentavos`.
 *
 * Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 4.8, 10.3
 */

import { proposta, formatarMoeda } from '@/data/proposta';
import { ValidadeBadge } from '@/components/ui/ValidadeBadge';

export function InvestimentoSection(): JSX.Element {
  const { investimento } = proposta;
  const { condicoesPagamento } = investimento;

  const entradaCentavos = Math.round(
    (investimento.totalCentavos * condicoesPagamento.entradaPct) / 100,
  );
  const saldoCentavos = investimento.totalCentavos - entradaCentavos;

  return (
    <section
      id="investimento"
      aria-labelledby="investimento-titulo"
      className="bg-bg-secondary px-4 py-16"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Investimento
            </p>
            <h2
              id="investimento-titulo"
              className="mt-1 font-heading text-3xl font-bold text-text-primary"
            >
              Valores da proposta
            </h2>
          </div>
          <ValidadeBadge />
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Desenvolvimento — pagamento único */}
          <article className="rounded-md border border-border-primary bg-bg-primary p-5">
            <h3 className="mb-3 font-heading text-lg font-semibold text-text-primary">
              Desenvolvimento (pagamento único)
            </h3>
            <table className="w-full text-left text-sm">
              <tbody>
                {investimento.itens.map((item) => (
                  <tr
                    key={item.descricao}
                    className="border-b border-border-primary"
                  >
                    <td className="py-2 pr-3 text-text-secondary">
                      {item.descricao}
                    </td>
                    <td className="py-2 pl-3 text-right font-medium text-text-primary tabular-nums">
                      {formatarMoeda(item.valorCentavos)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 pr-3 text-sm font-semibold uppercase tracking-wider text-text-primary">
                    Investimento total
                  </td>
                  <td className="pt-3 pl-3 text-right font-heading text-xl font-bold text-accent-primary tabular-nums">
                    {formatarMoeda(investimento.totalCentavos)}
                  </td>
                </tr>
              </tbody>
            </table>
          </article>

          {/* Suporte e manutenção — mensalidade */}
          <article className="rounded-md border border-border-primary bg-bg-primary p-5">
            <h3 className="mb-3 font-heading text-lg font-semibold text-text-primary">
              Suporte e manutenção mensal
            </h3>
            <p className="mb-3 font-heading text-xl font-bold text-text-primary">
              {formatarMoeda(investimento.mensalidadeCentavos)}
              <span className="ml-1 text-sm font-normal text-text-tertiary">
                /mês
              </span>
            </p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              {investimento.itensMensalidade.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent-primary">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Condições de pagamento */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border-primary bg-bg-primary p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Entrada {condicoesPagamento.entradaPct}%
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-text-primary tabular-nums">
              {formatarMoeda(entradaCentavos)}
            </p>
          </div>
          <div className="rounded-md border border-border-primary bg-bg-primary p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Saldo {condicoesPagamento.saldoPct}%
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-text-primary tabular-nums">
              {formatarMoeda(saldoCentavos)}
            </p>
          </div>
          <div className="rounded-md border border-border-primary bg-bg-primary p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Garantia
            </p>
            <p className="mt-1 font-heading text-lg font-bold text-text-primary">
              {investimento.garantiaDias} dias
            </p>
          </div>
        </div>

        <p className="text-xs text-text-tertiary">
          Formas de pagamento: {condicoesPagamento.formas.join(', ')}.
        </p>
      </div>
    </section>
  );
}

/**
 * src/data/benchmark.ts — Tabela comparativa de mercado da seção "Benchmark".
 *
 * Contém os dados estáticos renderizados pela seção `BenchmarkSection` da
 * Apresentacao. O objetivo é posicionar a Proposta da Lavita Code frente a três
 * alternativas típicas do mercado brasileiro de software para condomínios:
 *
 * 1. **SaaS white-label** — plataformas prontas com personalização limitada.
 * 2. **Desenvolvimento customizado Sudeste** — taxas horárias sênior de
 *    SP/RJ aplicadas a um escopo equivalente.
 * 3. **Concorrente regional** — estimativa de desenvolvimento sênior em
 *    praças do Nordeste com apps nativos.
 *
 * Valores estão como **strings formatadas** (e não centavos) porque as
 * colunas aqui expressam faixas (`'R$ 80.000 – R$ 150.000'`) e rótulos
 * qualitativos (`'Imediato'`), não montantes monetários operáveis. A única
 * linha com valor exato vinculado a `proposta.ts` é "Esta proposta (Lavita Code)";
 * sua equivalência numérica com `proposta.investimento.totalCentavos` é
 * verificada pelo teste da Task 3.4 (snapshot + asserção textual).
 *
 * {@link FONTES_BENCHMARK} lista os disclaimers exibidos como rodapé da
 * tabela (Req. 5.3), citando as bases das faixas apresentadas. Nenhuma fonte
 * externa é afirmada como fato; o texto deixa explícito que se trata de
 * estimativas e observações de mercado.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 10.3
 */

/**
 * Linha da tabela de benchmarking. Cada coluna corresponde a um eixo de
 * comparação exigido pelo Requisito 5.2: custo inicial, custo mensal,
 * prazo de entrega, propriedade do código e customização.
 */
export interface LinhaBenchmark {
  readonly opcao: string;
  readonly custoInicial: string;
  readonly custoMensal: string;
  readonly prazoEntrega: string;
  readonly propriedadeCodigo: 'Sim' | 'Não' | 'Parcial';
  readonly customizacao: 'Total' | 'Limitada' | 'Alta';
}

export const BENCHMARK: readonly LinhaBenchmark[] = [
  {
    opcao: 'Esta proposta (Lavita Code)',
    custoInicial: 'R$ 33.500',
    custoMensal: 'R$ 1.150',
    prazoEntrega: '10 semanas',
    propriedadeCodigo: 'Sim',
    customizacao: 'Total',
  },
  {
    opcao: 'SaaS white-label',
    custoInicial: 'R$ 0 (setup)',
    custoMensal: 'R$ 2.000 – R$ 6.000',
    prazoEntrega: 'Imediato',
    propriedadeCodigo: 'Não',
    customizacao: 'Limitada',
  },
  {
    opcao: 'Dev customizado Sudeste',
    custoInicial: 'R$ 80.000 – R$ 150.000',
    custoMensal: 'R$ 2.500 – R$ 5.000',
    prazoEntrega: '4 – 6 meses',
    propriedadeCodigo: 'Sim',
    customizacao: 'Total',
  },
  {
    opcao: 'Concorrente regional',
    custoInicial: 'R$ 40.000 – R$ 60.000',
    custoMensal: 'R$ 1.500 – R$ 2.500',
    prazoEntrega: '3 – 5 meses',
    propriedadeCodigo: 'Parcial',
    customizacao: 'Alta',
  },
];

/**
 * Notas de rodapé da tabela de benchmarking (Req. 5.3).
 *
 * Cada string é uma sentença curta que contextualiza a origem da faixa
 * apresentada. Evita afirmações absolutas sobre fontes externas — conforme
 * Premissa 5 do documento de requisitos, as faixas são estimativas próprias
 * baseadas em observação de mercado, não pesquisas publicadas.
 */
export const FONTES_BENCHMARK: readonly string[] = [
  'Faixas SaaS white-label: observadas em fornecedores brasileiros de apps de condomínio (2024–2026).',
  'Dev customizado Sudeste: estimativa com base em taxas horárias sênior de SP/RJ (R$ 200–350/h × 400–500h de desenvolvimento).',
  'Concorrente regional: estimativa de mercado para desenvolvimento sênior no Nordeste com apps nativos.',
  'Esta proposta: valores contratados em R$ 33.500 (pagamento único) + R$ 1.150/mês conforme seção 05 da Proposta Comercial.',
];

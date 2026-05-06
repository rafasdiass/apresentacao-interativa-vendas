/**
 * src/data/navegacao.ts — Estrutura da navegação principal da Apresentacao.
 *
 * Declara a ordem e os rótulos das 8 seções linearmente navegáveis pela
 * `NavBar` (desktop) e `NavBarMobile` (< 768px). Cada item mapeia para um
 * `id` de âncora que deve existir no DOM — essa correspondência é validada
 * pela **Property 9 (Consistência de roteamento da navegação)** no teste
 * de integração da Task 12.4.
 *
 * A ordem aqui definida é também a ordem de scroll linear da página (Req.
 * 1.1): Hero → Demo → Escopo → Cronograma → Investimento → Benchmark →
 * Diferenciais → Aceite. A seção da Demo vem **antes** de qualquer conteúdo
 * comercial de preço, aplicando a técnica de vendas do Req. 4.2 (demonstrar
 * valor antes de preço).
 *
 * O campo opcional {@link SecaoNav.notasApresentador} alimenta o Modo
 * Apresentador (Req. 7.3) — o texto é renderizado abaixo da seção apenas
 * quando `PresenterContext.active === true`. Cada nota é um lembrete curto
 * ao Vendedor sobre o ponto-chave daquela seção; não é exibido em modo
 * Cliente.
 *
 * Requirements: 1.1, 1.2, 7.3, 10.3
 */

/**
 * Item de navegação. O `id` corresponde ao atributo `id` do `<section>`
 * renderizado; o `label` é o rótulo visível no menu; `notasApresentador`
 * aparece somente no Modo Apresentador.
 */
export interface SecaoNav {
  readonly id: string;
  readonly label: string;
  readonly notasApresentador?: string;
}

/**
 * Sequência canônica das 8 seções da Apresentacao.
 *
 * ⚠️ A ordem e a quantidade importam: a Task 3.4 (teste unit) verifica que
 * `SECOES.length === 8` e que os `id`s aparecem exatamente nesta ordem, e a
 * Property 9 verifica que cada `id` existe no DOM após `<App />` montar.
 */
export const SECOES: readonly SecaoNav[] = [
  {
    id: 'hero',
    label: 'Início',
    notasApresentador:
      'Abrir com a proposta de valor: MVP em uso real a partir da Semana 7. Não mencionar preço ainda.',
  },
  {
    id: 'demo',
    label: 'Demonstração',
    notasApresentador:
      'Guiar pelo fluxo Morador → Síndico. Destaque a regra de 2h, o bloqueio automático e o KPI de conflitos resolvidos.',
  },
  {
    id: 'escopo',
    label: 'Escopo',
    notasApresentador:
      'Reforçar que as 3 áreas estão cobertas com automação, sem intervenção manual do síndico.',
  },
  {
    id: 'cronograma',
    label: 'Cronograma',
    notasApresentador:
      'Enfatizar entrega incremental e MVP Semana 7. Reduz risco percebido.',
  },
  {
    id: 'investimento',
    label: 'Investimento',
    notasApresentador:
      'R$ 33.500 desenvolvimento + R$ 1.150/mês. Entrada 50% / saldo 50%. Garantia 90 dias.',
  },
  {
    id: 'benchmarking',
    label: 'Benchmark',
    notasApresentador:
      'Comparar com SaaS white-label (mais barato mas sem propriedade) e dev Sudeste (mais caro). Nosso sweet spot: custo-benefício Fortaleza.',
  },
  {
    id: 'diferenciais',
    label: 'Diferenciais',
    notasApresentador:
      'Automação total, lançamento gradual, custo-benefício. Amarrar à Proposta seção 07.',
  },
  {
    id: 'aceite',
    label: 'Aceite',
    notasApresentador:
      'Fechar com pergunta direta: "Podemos iniciar o pagamento da entrada?" Se houver dúvida, CTA secundário WhatsApp.',
  },
];

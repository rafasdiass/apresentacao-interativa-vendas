/**
 * src/data/proposta.ts — Dados comerciais tipados da Proposta.
 *
 * Conteúdo extraído de `Proposta_Comercial_App_Condominio.docx` (cliente Ster,
 * desenvolvedor Lavita Code). Todos os valores monetários são expressos em
 * **centavos** (inteiros) para evitar erros de ponto flutuante; a conversão
 * para exibição em BRL é responsabilidade da Task 2.2 (`formatarMoeda`).
 *
 * Tarefa 2.1: apenas tipos e o literal `proposta` com `readonly`/`as const`.
 * Helpers (`formatarMoeda`, `parseMoeda`, `diasRestantes`, `validarProposta`)
 * são implementados nas Tasks 2.2 e 2.3.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.9, 10.3
 */

// ────────────────────────────────────────────────────────────────────────────
// Tipos (contrato do design.md, seção "Data Models")
// ────────────────────────────────────────────────────────────────────────────

export interface AreaEscopo {
  readonly nome: string;
  readonly horarioDiaUtil: string;
  readonly horarioFimDeSemana: string;
  readonly regraPrincipal: string;
}

export interface FaseCronograma {
  readonly fase: number;
  readonly semanas: string;
  readonly atividades: readonly string[];
  readonly entregaveis: readonly string[];
}

export interface ItemInvestimento {
  readonly descricao: string;
  readonly valorCentavos: number;
}

export interface Proposta {
  readonly cabecalho: {
    readonly cliente: string;
    readonly desenvolvedor: string;
    /** Data de emissão em ISO 8601 (`YYYY-MM-DD`). */
    readonly dataEmissao: string;
    readonly validadeDias: number;
  };
  readonly sumarioExecutivo: {
    readonly unidades: number;
    readonly semanas: number;
    readonly plataformas: readonly string[];
    readonly destaque: string;
  };
  readonly escopo: readonly AreaEscopo[];
  readonly cronograma: readonly FaseCronograma[];
  readonly investimento: {
    readonly itens: readonly ItemInvestimento[];
    readonly totalCentavos: number;
    readonly mensalidadeCentavos: number;
    readonly itensMensalidade: readonly string[];
    readonly condicoesPagamento: {
      readonly entradaPct: number;
      readonly saldoPct: number;
      readonly formas: readonly string[];
    };
    readonly garantiaDias: number;
  };
  readonly diferenciais: readonly string[];
  readonly contato: {
    /**
     * Número de WhatsApp em formato internacional (E.164).
     *
     * ⚠️ PLACEHOLDER — o número real será fornecido pela Lavita Code antes do deploy
     * (Requisitos → Premissas e Riscos, item 3).
     */
    readonly whatsappNumero: string;
    /** ⚠️ PLACEHOLDER — e-mail real de contato será fornecido antes do deploy. */
    readonly email: string;
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Literal `proposta` — valores autoritativos extraídos do .docx
// ────────────────────────────────────────────────────────────────────────────

export const proposta: Proposta = {
  cabecalho: {
    cliente: 'Ster',
    desenvolvedor: 'Lavita Code',
    dataEmissao: '2026-05-05',
    validadeDias: 30,
  },
  sumarioExecutivo: {
    unidades: 520,
    semanas: 10,
    plataformas: ['iOS', 'Android'],
    destaque: 'MVP em uso real a partir da Semana 7',
  },
  escopo: [
    {
      nome: 'Quadra de Vôlei',
      horarioDiaUtil: '08:00 às 22:00',
      horarioFimDeSemana: '08:00 às 00:00',
      regraPrincipal: 'Limite de 2h por casa',
    },
    {
      nome: 'Piscina',
      horarioDiaUtil: 'Seg/Qui: Fechado | Ter/Qua/Sex: 08h–12h e 15h–20h',
      horarioFimDeSemana: 'Sáb: 08h–12h e 16h–21h | Dom: 08h–12h e 14h30–19h',
      regraPrincipal: 'Informativo de funcionamento e manutenção',
    },
    {
      nome: 'Deck e Salão',
      horarioDiaUtil: 'Horários em aberto',
      horarioFimDeSemana: 'Horários em aberto',
      regraPrincipal: 'Reserva exclusiva por unidade',
    },
  ],
  cronograma: [
    {
      fase: 1,
      semanas: '1–2',
      atividades: [
        'Alinhamento de identidade visual',
        'Protótipo navegável das telas de agendamento',
        'Definição de paleta e logo do condomínio',
      ],
      entregaveis: ['Protótipo aprovado'],
    },
    {
      fase: 2,
      semanas: '3–6',
      atividades: [
        'Backend NestJS + banco de dados',
        'Login de unidades',
        'Lógica de agendamento da quadra de vôlei e áreas em aberto',
        'Painel administrativo inicial',
      ],
      entregaveis: ['Versão Alpha (Web App)'],
    },
    {
      fase: 3,
      semanas: '7–8',
      atividades: [
        'Adaptação Android/iOS via Ionic Capacitor',
        'Módulo informativo da piscina',
        'Painel admin completo',
        'Testes com moradores piloto',
      ],
      entregaveis: ['MVP em uso real'],
    },
    {
      fase: 4,
      semanas: '9–10',
      atividades: [
        'Publicação Google Play e App Store',
        'Testes de carga simulando 520 unidades',
        'Manuais de uso',
        'Treinamento do síndico',
      ],
      entregaveis: ['Apps publicados'],
    },
  ],
  investimento: {
    itens: [
      {
        descricao: 'Backend NestJS + Painel Administrativo',
        valorCentavos: 1_500_000, // R$ 15.000,00
      },
      {
        descricao: 'Aplicativo Mobile (Ionic/Angular) — Android e iOS',
        valorCentavos: 1_850_000, // R$ 18.500,00
      },
    ],
    totalCentavos: 3_350_000, // R$ 33.500,00
    mensalidadeCentavos: 115_000, // R$ 1.150,00
    itensMensalidade: [
      'Hospedagem em nuvem + monitoramento 24/7',
      'Correção de bugs e atualizações de segurança',
      'Backups semanais automáticos',
      'Atualizações de compatibilidade Android/iOS',
      'Atendimento via WhatsApp/e-mail em horário comercial',
    ],
    condicoesPagamento: {
      entradaPct: 50,
      saldoPct: 50,
      formas: ['PIX', 'Transferência bancária', 'Boleto'],
    },
    garantiaDias: 90,
  },
  diferenciais: [
    'Automação total — o app nasce sabendo que a piscina fecha na segunda e a quadra tem limite de 2h. Zero intervenção manual do síndico nas regras.',
    'Lançamento gradual — já na Semana 7 os moradores podem usar o sistema em produção, mesmo antes da publicação oficial nas lojas.',
    'Custo-benefício — mão de obra qualificada de Fortaleza com entrega de nível sênior, abaixo dos preços praticados no Sudeste.',
  ],
  contato: {
    whatsappNumero: '+5585994448858',
    email: 'contato@lavitacode.com.br',
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Helpers monetários e de validade (Task 2.2)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Regex que reconhece a saída canônica de {@link formatarMoeda}.
 *
 * Aceita sinal negativo opcional, prefixo `R$ ` (espaço U+0020), grupos de
 * milhares separados por `.` e exatamente 2 casas decimais após a `,`.
 */
const MOEDA_REGEX = /^-?R\$\s\d{1,3}(\.\d{3})*,\d{2}$/;

/**
 * Número de milissegundos em um dia (24h × 60min × 60s × 1000ms).
 * Usado por {@link diasRestantes} para conversão de ms → dias.
 */
const MS_POR_DIA = 86_400_000;

/**
 * Formata um valor monetário inteiro em centavos para o padrão brasileiro.
 *
 * Usa `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` e
 * normaliza o espaço estreito não-quebrável (U+00A0) que o ICU insere entre
 * `R$` e o número para um espaço comum (U+0020). Essa normalização torna a
 * saída round-trippable via regex simples em {@link parseMoeda}.
 *
 * @param centavos - valor em centavos. Deve ser um inteiro (positivo ou negativo).
 * @returns string formatada no padrão `R$ X.XXX,XX` (ou `-R$ X.XXX,XX` para negativos).
 * @throws {Error} se `centavos` não for inteiro.
 *
 * @example
 * formatarMoeda(1_500_000); // 'R$ 15.000,00'
 * formatarMoeda(0);          // 'R$ 0,00'
 * formatarMoeda(-100);       // '-R$ 1,00'
 */
export function formatarMoeda(centavos: number): string {
  if (!Number.isInteger(centavos)) {
    throw new Error('formatarMoeda: centavos deve ser inteiro');
  }
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatter.format(centavos / 100).replace(/\u00A0/g, ' ');
}

/**
 * Inversa de {@link formatarMoeda}: converte uma string no formato `R$ X.XXX,XX`
 * de volta para o valor inteiro em centavos.
 *
 * O algoritmo remove o prefixo `R$`, todos os espaços e os separadores de
 * milhar `.`, troca a vírgula decimal por ponto, converte para `Number` e
 * multiplica por 100, arredondando para inteiro com `Math.round` (para
 * eliminar ruído de ponto flutuante residual — ex.: `18.5 * 100 = 1849.9999…`).
 *
 * @param formatado - string no formato exato produzido por {@link formatarMoeda}.
 * @returns valor em centavos como inteiro.
 * @throws {Error} se `formatado` não casar com o padrão esperado.
 *
 * @example
 * parseMoeda('R$ 15.000,00'); // 1_500_000
 * parseMoeda('R$ 0,00');       // 0
 */
export function parseMoeda(formatado: string): number {
  if (!MOEDA_REGEX.test(formatado)) {
    throw new Error('parseMoeda: formato inválido');
  }
  const normalizado = formatado
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const reais = Number(normalizado);
  return Math.round(reais * 100);
}

/**
 * Calcula quantos dias restam até o vencimento da Proposta em relação à data
 * `hoje`. Usa `Math.floor` na divisão ms → dias para alinhar com a semântica
 * da Property 10 (validade monotônica):
 *
 * - Quando `hoje === dataEmissao` (exatamente 00:00 UTC), retorna `validadeDias`.
 * - Quando `hoje > dataEmissao + validadeDias`, retorna um inteiro `≤ 0`
 *   (Proposta vencida).
 * - Quando `hoje < dataEmissao`, retorna um inteiro `≥ validadeDias`.
 *
 * A `dataEmissao` é interpretada como 00:00 UTC para evitar surpresas de
 * fuso horário local do dispositivo do Cliente.
 *
 * @param proposta - literal tipado com `cabecalho.dataEmissao` (ISO `YYYY-MM-DD`) e `validadeDias`.
 * @param hoje - data de referência (normalmente `new Date()`).
 * @returns número inteiro de dias restantes; pode ser negativo após o vencimento.
 *
 * @example
 * // Proposta emitida em 2026-05-05, validade 30 dias.
 * diasRestantes(proposta, new Date('2026-05-05T00:00:00Z')); // 30
 * diasRestantes(proposta, new Date('2026-06-04T00:00:00Z')); // 0
 * diasRestantes(proposta, new Date('2026-06-05T00:00:00Z')); // -1
 */
export function diasRestantes(proposta: Proposta, hoje: Date): number {
  const emissao = new Date(`${proposta.cabecalho.dataEmissao}T00:00:00Z`);
  const expiraEm = emissao.getTime() + proposta.cabecalho.validadeDias * MS_POR_DIA;
  return Math.floor((expiraEm - hoje.getTime()) / MS_POR_DIA);
}

/**
 * Valida em tempo de execução as invariantes estruturais da Proposta.
 *
 * A função recebe um valor já tipado como {@link Proposta} — ou seja, a
 * tipagem estática do TypeScript garante o formato dos campos. O que esta
 * função acrescenta são invariantes **numéricas e semânticas** que o sistema
 * de tipos não consegue expressar (ex.: que a soma dos itens bate com o
 * total declarado). É, portanto, um *runtime invariant check*, não um
 * validador de schema (nada de `zod` aqui).
 *
 * Pontos de uso previstos:
 *
 * 1. **Tempo de teste (Task 2.4 — PBT)**: a Property 1 gera arrays
 *    arbitrários de `ItemInvestimento` e verifica que `validarProposta`
 *    passa quando `totalCentavos === soma(itens)` e falha caso contrário.
 * 2. **Tempo de build (Task 4.1 — script `prebuild`)**: `scripts/validate-
 *    proposta.ts` importa `proposta` + `validarProposta` e sai com código
 *    diferente de zero se alguma invariante for violada, impedindo deploys
 *    com dados comerciais inconsistentes.
 *
 * Invariantes verificadas (em ordem):
 *
 * 1. Itens de investimento não vazios.
 * 2. `soma(itens[].valorCentavos) === investimento.totalCentavos`.
 * 3. `condicoesPagamento.entradaPct + saldoPct === 100`.
 * 4. `cabecalho.validadeDias > 0`.
 * 5. `investimento.mensalidadeCentavos >= 0`.
 * 6. `investimento.garantiaDias >= 0`.
 * 7. `sumarioExecutivo.unidades > 0`.
 * 8. `sumarioExecutivo.semanas > 0`.
 *
 * @param p - objeto {@link Proposta} a validar.
 * @throws {Error} com mensagem descritiva identificando a invariante violada.
 *
 * @example
 * validarProposta(proposta); // passa silenciosamente no literal canônico
 *
 * @example
 * // Totalização quebrada → lança erro descritivo.
 * validarProposta({ ...proposta, investimento: { ...proposta.investimento, totalCentavos: 999 } });
 * // Error: Totalização inválida: itens somam 3350000 centavos mas totalCentavos=999
 */
export function validarProposta(p: Proposta): void {
  if (p.investimento.itens.length === 0) {
    throw new Error('Itens de investimento vazios');
  }

  const somaItens = p.investimento.itens.reduce(
    (acc, item) => acc + item.valorCentavos,
    0,
  );
  if (somaItens !== p.investimento.totalCentavos) {
    throw new Error(
      `Totalização inválida: itens somam ${somaItens} centavos mas totalCentavos=${p.investimento.totalCentavos}`,
    );
  }

  const somaPct =
    p.investimento.condicoesPagamento.entradaPct +
    p.investimento.condicoesPagamento.saldoPct;
  if (somaPct !== 100) {
    throw new Error(
      `Condições de pagamento inválidas: entradaPct+saldoPct=${somaPct}, esperado 100`,
    );
  }

  if (p.cabecalho.validadeDias <= 0) {
    throw new Error(
      `Validade inválida: validadeDias=${p.cabecalho.validadeDias}, esperado > 0`,
    );
  }

  if (p.investimento.mensalidadeCentavos < 0) {
    throw new Error('Mensalidade negativa');
  }

  if (p.investimento.garantiaDias < 0) {
    throw new Error('Garantia negativa');
  }

  if (p.sumarioExecutivo.unidades <= 0) {
    throw new Error('Unidades inválidas');
  }

  if (p.sumarioExecutivo.semanas <= 0) {
    throw new Error('Semanas inválidas');
  }
}

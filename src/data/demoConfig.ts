/**
 * src/data/demoConfig.ts — Configuração tipada da Demo interativa.
 *
 * Contém os dados estáticos que alimentam as visões do Morador e do Síndico
 * na seção "Demonstração Interativa" da Apresentacao:
 *
 * - {@link AREAS}: catálogo das três Áreas Comuns do condomínio (Quadra,
 *   Deck, Piscina) com horários de fechamento, duração máxima de reserva e
 *   grade base de slots horários.
 * - {@link KPIS_SINDICO}: 4 indicadores numéricos exibidos no painel do
 *   Síndico.
 * - {@link ACOES_RAPIDAS_SINDICO}: 3 ações rápidas do Síndico. Cada ação
 *   é descrita aqui apenas como texto; a interação real (tooltip/modal)
 *   substitui as chamadas indefinidas de `sendPrompt(...)` do HTML
 *   original (Bug #1 da análise de artefatos existentes).
 * - {@link ULTIMAS_RESERVAS_MOCK}: lista estática das 4 reservas recentes
 *   renderizadas no painel do Síndico.
 *
 * ⚠️ Tipos `AreaId`, `Slot` e `AreaConfig` estão definidos **inline** aqui
 * por decisão da Task 3.1, para evitar dependência circular temporária com
 * `src/features/demo/types.ts` (ainda inexistente). A Task 5.1 vai
 * re-exportar esses tipos a partir de `src/features/demo/types.ts`.
 *
 * Requirements: 3.3, 3.4, 3.10, 3.11, 10.3, 10.8, 11.2, 11.5
 */

// ────────────────────────────────────────────────────────────────────────────
// Tipos (definidos inline; serão re-exportados por features/demo/types.ts na Task 5.1)
// ────────────────────────────────────────────────────────────────────────────

/** Identificador de Area_Comum gerenciada pela Demo. */
export type AreaId = 'quadra' | 'deck' | 'piscina';

/**
 * Slot horário no formato `HH:MM` (24h).
 *
 * Usa template literal type para restringir a strings como `'08:00'`,
 * `'13:30'`, `'00:00'`. O formato é validado estruturalmente em tempo de
 * compilação; validações semânticas adicionais (ex.: minutos `< 60`) são
 * responsabilidade do `demoReducer` na Task 5.2.
 */
export type Slot = `${number}${number}:${number}${number}`;

/**
 * Configuração de uma Area_Comum do condomínio.
 *
 * Todas as referências a horários usam o tipo {@link Slot}, inclusive o
 * sentinel `'00:00'` para significar "fim do dia" (meia-noite) na Quadra
 * e no Deck aos finais de semana.
 */
export interface AreaConfig {
  readonly id: AreaId;
  readonly nome: string;
  /** Horário de fechamento em dias úteis, formato `HH:MM`. Ex.: `'22:00'`. */
  readonly fechamentoDiaUtil: Slot;
  /** Horário de fechamento em finais de semana / feriados. `'00:00'` = meia-noite (fim do dia). */
  readonly fechamentoFimDeSemana: Slot;
  /** Duração máxima (em horas) de uma reserva nessa área. */
  readonly duracaoMaxHoras: number;
  /** Se a área aceita reservas (`false` para Piscina — apenas informativa). */
  readonly reservavel: boolean;
  /** Lista base de slots em ordem horária (expediente completo). */
  readonly slotsBase: readonly Slot[];
}

/** KPI renderizado no grid superior do painel do Síndico. */
export interface KpiSindico {
  readonly label: string;
  readonly valor: string;
  readonly delta?: string;
  readonly tom: 'positivo' | 'neutro';
}

/**
 * Ação rápida do Síndico. O texto de {@link descricao} alimenta o tooltip
 * ou modal que substitui a chamada indefinida `sendPrompt(...)` do HTML
 * original (Bug #1).
 */
export interface AcaoRapidaSindico {
  readonly titulo: string;
  readonly descricao: string;
}

/** Entrada da lista "Últimas reservas" no painel do Síndico. */
export interface ReservaMock {
  readonly casa: string;
  readonly area: string;
  readonly tempoRelativo: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Catálogo de Áreas
// ────────────────────────────────────────────────────────────────────────────

/**
 * Slots base da Quadra: uma entrada a cada hora cheia entre `08:00` e
 * `21:00` inclusive (14 slots). O slot das `21:00` em dias úteis fica
 * fora do expediente quando combinado com `duracaoMaxHoras = 2`
 * (21h + 2h = 23h > fechamento 22h), corrigindo o Bug #6 do HTML
 * original — o `demoReducer` deve tratar esse caso como
 * `'fora-do-expediente'` (validado pela Property 5).
 */
const SLOTS_QUADRA: readonly Slot[] = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

/**
 * Slots base do Deck/Salão: blocos de 2 horas (`08:00`, `10:00`, …, `20:00`),
 * alinhados ao uso típico de reserva exclusiva para eventos.
 */
const SLOTS_DECK: readonly Slot[] = [
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
];

export const AREAS: Readonly<Record<AreaId, AreaConfig>> = {
  quadra: {
    id: 'quadra',
    nome: 'Quadra de Vôlei',
    fechamentoDiaUtil: '22:00',
    fechamentoFimDeSemana: '00:00',
    duracaoMaxHoras: 2,
    reservavel: true,
    slotsBase: SLOTS_QUADRA,
  },
  deck: {
    id: 'deck',
    nome: 'Deck e Salão',
    fechamentoDiaUtil: '22:00',
    fechamentoFimDeSemana: '00:00',
    duracaoMaxHoras: 4,
    reservavel: true,
    slotsBase: SLOTS_DECK,
  },
  piscina: {
    id: 'piscina',
    nome: 'Piscina',
    fechamentoDiaUtil: '20:00',
    fechamentoFimDeSemana: '21:00',
    // Piscina não é reservável; valor simbólico — a Property 8 garante
    // que nenhuma reserva é criada para essa área independentemente do
    // valor deste campo.
    duracaoMaxHoras: 0,
    reservavel: false,
    slotsBase: [],
  },
};

// ────────────────────────────────────────────────────────────────────────────
// KPIs e ações do Síndico + últimas reservas
// ────────────────────────────────────────────────────────────────────────────

export const KPIS_SINDICO: readonly KpiSindico[] = [
  { label: 'Reservas hoje', valor: '23', delta: '+18% vs. ontem', tom: 'positivo' },
  { label: 'Ocupação atual', valor: '76%', delta: '3 áreas ocupadas', tom: 'neutro' },
  { label: 'Casas ativas', valor: '487', delta: 'de 520 unidades', tom: 'neutro' },
  { label: 'Conflitos resolvidos', valor: '100%', delta: 'Automático', tom: 'positivo' },
];

export const ACOES_RAPIDAS_SINDICO: readonly AcaoRapidaSindico[] = [
  {
    titulo: 'Bloquear área para manutenção',
    descricao:
      'No painel admin, o síndico seleciona a área, define o período (datas e horários) e publica imediatamente. O app bloqueia novas reservas no intervalo escolhido e envia notificação push para moradores com reservas impactadas, oferecendo reagendamento automático na próxima janela livre.',
  },
  {
    titulo: 'Alterar horários de funcionamento',
    descricao:
      'Cada área tem horários editáveis por dia da semana (seg–dom) e exceções para feriados. Mudanças entram em vigor para reservas futuras; reservas já confirmadas são preservadas. Útil para horário de verão, campeonatos e eventos especiais.',
  },
  {
    titulo: 'Exportar relatório mensal',
    descricao:
      'Gera CSV/PDF com todas as reservas do mês (unidade, área, horário, status). Usado pela portaria e zeladoria para controle de acesso e planejamento de manutenção. Filtros por área e status disponíveis.',
  },
];

export const ULTIMAS_RESERVAS_MOCK: readonly ReservaMock[] = [
  { casa: 'Casa 247', area: 'Quadra', tempoRelativo: 'há 2 min' },
  { casa: 'Casa 089', area: 'Salão', tempoRelativo: 'há 14 min' },
  { casa: 'Casa 401', area: 'Quadra', tempoRelativo: 'há 38 min' },
  { casa: 'Casa 134', area: 'Quadra', tempoRelativo: 'há 1h' },
];

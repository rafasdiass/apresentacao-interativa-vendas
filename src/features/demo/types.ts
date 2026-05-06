/**
 * src/features/demo/types.ts — Tipos e estado inicial da Demo interativa.
 *
 * Este módulo é o ponto canônico de tipos da feature `demo`. Ele:
 *
 * 1. **Re-exporta** os tipos estruturais (`AreaId`, `Slot`, `AreaConfig`)
 *    que, por decisão da Task 3.1, foram declarados inline em
 *    `src/data/demoConfig.ts` para evitar dependência circular antes que
 *    o diretório `features/demo` existisse. A partir desta Task 5.1, os
 *    consumidores devem preferir importar desses tipos **daqui**, mantendo
 *    `demoConfig.ts` como fonte única dos *dados* (o `AREAS` etc.).
 *
 * 2. Define os tipos do núcleo puro: {@link DemoState}, {@link DemoAction},
 *    {@link UltimaConfirmacao}, {@link StatusSlot} e {@link SlotComStatus}
 *    — consumidos pelo `demoReducer` (Task 5.2), pelos helpers derivados
 *    (Task 5.3) e pelo hook `useDemoReservas` (Task 5.4).
 *
 * 3. Exporta {@link initialDemoState}, o estado semente da Demo, com seed
 *    de 4 reservas na Quadra (`10:00`, `14:00`, `15:00`, `20:00`) para
 *    reproduzir a aparência realista do HTML original no primeiro render.
 *
 * 4. Expõe o utilitário {@link AREAS_ARR} para iteração tipada sobre
 *    `AreaId` em testes e helpers, sem precisar de `Object.keys` com
 *    narrowing manual.
 *
 * Requirements: 3.9, 10.8, 11.5
 */

// ────────────────────────────────────────────────────────────────────────────
// Re-exports — tipos estruturais declarados em src/data/demoConfig.ts
// ────────────────────────────────────────────────────────────────────────────

/** Identificador de Area_Comum gerenciada pela Demo (Quadra, Deck, Piscina). */
export type { AreaId } from '@/data/demoConfig';

/** Slot horário no formato `HH:MM` (24h). Ver documentação em `demoConfig.ts`. */
export type { Slot } from '@/data/demoConfig';

/** Configuração de uma Area_Comum (horários, duração máxima, reservável). */
export type { AreaConfig } from '@/data/demoConfig';

// Imports locais (usados apenas em tipagem interna deste módulo).
import type { AreaId, Slot } from '@/data/demoConfig';

// ────────────────────────────────────────────────────────────────────────────
// Tipos novos — núcleo puro da Demo
// ────────────────────────────────────────────────────────────────────────────

/**
 * Registro do último `CONFIRM` bem-sucedido, usado para renderizar a
 * mensagem de confirmação com `role="status"` (acessível, não bloqueante)
 * logo abaixo do `ConfirmButton`.
 *
 * - `area`: a área em que a reserva foi feita.
 * - `slot`: horário de início da reserva (ex.: `'14:00'`).
 * - `fim`: horário de término calculado como `slot + AREAS[area].duracaoMaxHoras`,
 *   respeitando o fechamento (nunca ultrapassa `fechamentoDiaUtil`).
 */
export interface UltimaConfirmacao {
  readonly area: AreaId;
  readonly slot: Slot;
  readonly fim: Slot;
}

/**
 * Estado completo da Demo interativa.
 *
 * O reducer é puro: todas as transições produzem uma nova instância
 * imutável deste estado. Todas as propriedades são `readonly` para
 * documentar essa intenção no nível de tipo; a imutabilidade em tempo
 * de execução depende das implementações do reducer e dos helpers.
 */
export interface DemoState {
  /** Visão ativa das duas abas da Demo. */
  readonly view: 'morador' | 'sindico';
  /** Área selecionada no carrossel de {@link AreaCard}. */
  readonly areaSelecionada: AreaId;
  /** Slot atualmente destacado (`null` se nenhum foi selecionado). */
  readonly slotSelecionado: Slot | null;
  /**
   * Mapa de reservas confirmadas por área. Cada lista é um conjunto
   * (sem duplicatas — ver Property 3) de slots horários já reservados.
   */
  readonly reservasPorArea: Readonly<Record<AreaId, readonly Slot[]>>;
  /** Última confirmação bem-sucedida, ou `null` antes de qualquer `CONFIRM`. */
  readonly ultimaConfirmacao: UltimaConfirmacao | null;
}

/**
 * União discriminada das ações aceitas pelo `demoReducer`.
 *
 * - `SWITCH_VIEW`: alterna entre a aba Morador e a aba Síndico sem tocar
 *   em `reservasPorArea`, `areaSelecionada` ou `slotSelecionado`
 *   (Property 7).
 * - `SELECT_AREA`: troca a área ativa e reseta `slotSelecionado`.
 * - `SELECT_SLOT`: tenta selecionar um slot; é no-op se a área não for
 *   reservável, se o slot estiver ocupado ou se ultrapassar o fechamento.
 * - `CONFIRM`: confirma a reserva do `slotSelecionado` na `areaSelecionada`.
 * - `RESET`: volta ao {@link initialDemoState}.
 */
export type DemoAction =
  | { type: 'SWITCH_VIEW'; view: 'morador' | 'sindico' }
  | { type: 'SELECT_AREA'; area: AreaId }
  | { type: 'SELECT_SLOT'; slot: Slot }
  | { type: 'CONFIRM' }
  | { type: 'RESET' };

/**
 * Status visual de um slot horário no grid da Demo.
 *
 * - `'livre'`: disponível para reserva.
 * - `'ocupado'`: já reservado (presente em `reservasPorArea[area]`).
 * - `'fora-do-expediente'`: o slot existe em `slotsBase`, mas reservá-lo
 *   violaria a regra `slot + duracaoMaxHoras > fechamento` (Property 5).
 */
export type StatusSlot = 'livre' | 'ocupado' | 'fora-do-expediente';

/**
 * Par `(slot, status)` retornado pelo helper derivado `slotsComStatus`
 * (Task 5.3). Os três conjuntos particionam os slots base da área
 * (Property 4).
 */
export interface SlotComStatus {
  readonly slot: Slot;
  readonly status: StatusSlot;
}

/**
 * Regime de funcionamento de uma Area_Comum, utilizado por helpers
 * derivados para decidir entre `fechamentoDiaUtil` e
 * `fechamentoFimDeSemana` de uma {@link AreaConfig}.
 *
 * Para o MVP, o reducer e os helpers assumem `'dia-util'`; uma versão
 * futura pode ler o dia da semana atual e alternar automaticamente.
 */
export type Duty = 'dia-util' | 'fim-de-semana';

// ────────────────────────────────────────────────────────────────────────────
// Constantes auxiliares
// ────────────────────────────────────────────────────────────────────────────

/**
 * Lista ordenada dos identificadores de área.
 *
 * Exposta separadamente do objeto `AREAS` (em `demoConfig.ts`) para que
 * testes e helpers possam iterar com tipagem exata sobre `AreaId`, sem
 * recorrer a `Object.keys(AREAS)` — que em TS retorna `string[]` e
 * exigiria narrowing manual.
 */
export const AREAS_ARR: readonly AreaId[] = ['quadra', 'deck', 'piscina'];

/**
 * Estado inicial da Demo.
 *
 * O seed de 4 reservas na Quadra (`10:00`, `14:00`, `15:00`, `20:00`)
 * reproduz o look-and-feel do HTML original — no primeiro render o
 * morador já vê alguns horários ocupados, tornando a demonstração mais
 * realista. As outras áreas começam vazias.
 *
 * A anotação explícita `: DemoState` garante imutabilidade no nível de
 * tipo; não usamos `as const` no objeto externo porque isso produziria
 * tuplas (ex.: `readonly ['10:00', '14:00', ...]`) incompatíveis com o
 * tipo `readonly Slot[]` declarado em {@link DemoState.reservasPorArea}.
 */
export const initialDemoState: DemoState = {
  view: 'morador',
  areaSelecionada: 'quadra',
  slotSelecionado: null,
  reservasPorArea: {
    quadra: ['10:00', '14:00', '15:00', '20:00'],
    deck: [],
    piscina: [],
  },
  ultimaConfirmacao: null,
};

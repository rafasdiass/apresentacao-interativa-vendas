/**
 * src/features/demo/__tests__/helpers/demoArbitraries.ts
 *
 * Arbitrários fast-check compartilhados pelos property tests da feature
 * `demo-morador-mvp-polish`. Centraliza a geração de {@link DemoAction}
 * e de sequências de ações para que todas as properties (P1–P3 em
 * `DemoMorador.layout.pbt.test.tsx` e demais) partam do mesmo espaço de
 * busca, evitando duplicação da definição dos `fc.oneof(...)` em cada
 * arquivo de teste.
 *
 * O desenho segue o padrão já estabelecido em
 * `src/features/demo/__tests__/demoReducer.pbt.test.ts`:
 *
 * - `fc.constant('...' as const)` preserva o literal string no tipo
 *   inferido pelo `fc.record`, produzindo `DemoAction` exatamente — sem
 *   `as` ou cast no consumidor.
 * - `fc.constantFrom(...AREAS_ARR)` e `fc.constantFrom(...allSlots)`
 *   aproveitam o conhecimento do domínio: o reducer tem guardas
 *   (`slotsBase.includes`, `reservavel`) que rejeitam slots fora da
 *   grade da área ativa, então enviar um slot "errado" é um no-op
 *   determinístico e faz parte do espaço de busca legítimo para testar
 *   robustez.
 * - `allSlots` é a união dos `slotsBase` de todas as áreas. Como
 *   `AREAS.piscina.slotsBase` é vazio (Piscina não é reservável), o
 *   conjunto final contém os slots de Quadra ∪ Deck, sem duplicatas.
 *
 * `actionSequenceArb` usa `maxLength: 20` — suficiente para cobrir
 * transições interessantes sem inflar o tempo de execução de cada
 * property test consumidor (que renderiza `<DemoMorador>` para cada
 * sequência gerada).
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.6
 */

import { fc } from '@fast-check/vitest';
import { AREAS } from '@/data/demoConfig';
import { AREAS_ARR } from '../../types';
import type { DemoAction } from '../../types';

/**
 * União de todos os slots que qualquer área possa referenciar.
 *
 * Construído via `AREAS_ARR.flatMap(...)` para manter acoplamento zero
 * com a ordem ou cardinalidade das áreas — se uma nova área for
 * adicionada ao `AREAS`/`AREAS_ARR`, seus slots entram automaticamente
 * no conjunto. O `Set` elimina duplicatas (ex.: `'14:00'` existe tanto
 * na Quadra quanto no Deck).
 */
const allSlots = Array.from(
  new Set(AREAS_ARR.flatMap((id) => AREAS[id].slotsBase)),
);

/**
 * Arbitrary que amostra uniformemente uma {@link DemoAction} de
 * qualquer uma das cinco variantes (`SWITCH_VIEW`, `SELECT_AREA`,
 * `SELECT_SLOT`, `CONFIRM`, `RESET`).
 */
export const demoActionArb: fc.Arbitrary<DemoAction> = fc.oneof(
  fc.record({
    type: fc.constant('SWITCH_VIEW' as const),
    view: fc.constantFrom<'morador' | 'sindico'>('morador', 'sindico'),
  }),
  fc.record({
    type: fc.constant('SELECT_AREA' as const),
    area: fc.constantFrom(...AREAS_ARR),
  }),
  fc.record({
    type: fc.constant('SELECT_SLOT' as const),
    slot: fc.constantFrom(...allSlots),
  }),
  fc.record({ type: fc.constant('CONFIRM' as const) }),
  fc.record({ type: fc.constant('RESET' as const) }),
);

/**
 * Sequência de 0 a 20 ações. Limite superior escolhido para equilibrar
 * cobertura de transições e custo por run — cada property test que
 * consome este arbitrário renderiza `<DemoMorador>` por execução, então
 * sequências maiores multiplicariam o tempo de teste sem ganho
 * significativo de cobertura (o reducer é puro e transições
 * interessantes aparecem cedo).
 */
export const actionSequenceArb: fc.Arbitrary<readonly DemoAction[]> = fc.array(
  demoActionArb,
  { minLength: 0, maxLength: 20 },
);

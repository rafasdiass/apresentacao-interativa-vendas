/**
 * src/features/demo/DemoSindico.tsx — Raiz da aba "Painel do Síndico".
 *
 * Compõe os quatro blocos estáticos do painel administrativo na ordem
 * visual do HTML original:
 *
 *   1. `KpiGrid`       — 4 KPIs em grid 2×2 (mobile) / 1×4 (sm+).
 *   2. `MapaOcupacao`  — mapa de ocupação em tempo real por área.
 *   3. `AcoesRapidas` + `UltimasReservas` lado a lado em grid 2-col
 *      (colapsa em 1-col no mobile).
 *
 * **Sobre a prop `demo`**
 *
 * O `DemoSection` (Task 7.11) eleva uma única instância de
 * `useDemoReservas` e a distribui para `DemoMorador` e `DemoSindico`
 * como prop. Isso é o que sustenta a Property 7 (Req. 3.2 / 12.9): ao
 * alternar abas, o estado da Demo (área selecionada, slots reservados,
 * última confirmação) precisa ser preservado. Se cada aba tivesse sua
 * própria instância do hook, o estado do Morador seria descartado
 * quando o usuário entrasse na aba do Síndico e voltasse.
 *
 * A prop é declarada mas **não usada no MVP** — o painel é atualmente
 * estático (KPIs, mapa, ações e últimas reservas vêm de `demoConfig`).
 * Manter a prop na interface:
 *
 *   - Simetria com `DemoMoradorProps` (ambos recebem o mesmo contrato).
 *   - Permite evolução futura sem mudar a API: o mapa e KPIs podem
 *     passar a refletir `demo.state.reservasPorArea` e os contadores
 *     derivados ficarão ao vivo.
 *
 * O `demo: _demo` descarta o parâmetro evitando `no-unused-vars` do
 * ESLint/TS sem precisar de `eslint-disable`.
 *
 * Requirements: 3.11, 3.2, 12.9
 */

import type { UseDemoReservasReturn } from './useDemoReservas';
import { AcoesRapidas } from './components/sindico/AcoesRapidas';
import { KpiGrid } from './components/sindico/KpiGrid';
import { MapaOcupacao } from './components/sindico/MapaOcupacao';
import { UltimasReservas } from './components/sindico/UltimasReservas';

export interface DemoSindicoProps {
  readonly demo: UseDemoReservasReturn;
}

export function DemoSindico({ demo: _demo }: DemoSindicoProps): JSX.Element {
  return (
    <div className="space-y-6">
      <KpiGrid />
      <MapaOcupacao />
      <div className="grid gap-6 md:grid-cols-2">
        <AcoesRapidas />
        <UltimasReservas />
      </div>
    </div>
  );
}

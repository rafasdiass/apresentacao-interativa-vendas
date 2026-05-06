/**
 * src/features/demo/DemoMorador.tsx — Raiz da aba "Visão do Morador".
 *
 * Compõe a experiência completa do Morador em duas colunas:
 *
 *   - **Esquerda** — `MobileMockup` com:
 *       1. Radiogroup de três `AreaCard` (Quadra, Deck, Piscina), na
 *          ordem fixa `['quadra', 'deck', 'piscina']`. Iterar a ordem
 *          explicitamente em vez de `Object.values(AREAS)` evita
 *          depender da ordem de iteração de chaves do objeto — relevante
 *          em `noUncheckedIndexedAccess` onde `Object.values` devolve um
 *          `AreaConfig[]` sem garantia de ordenação estável.
 *       2. `SlotGrid` com os slots da área atualmente selecionada.
 *       3. `ConfirmButton` que dispara `CONFIRM` no reducer.
 *       4. `ConfirmMessage` acessível (role=status) quando há última
 *          confirmação.
 *
 *   - **Direita** — narrativa de vendas com título, parágrafo, dois
 *     mini-cards de destaque ("2h" / "24/7"), a `TimelineProximas` e um
 *     botão "Ver fluxo completo" que abre `DialogoFluxoMorador`.
 *
 * **Sobre a prop `demo`**
 *
 * A instância de `useDemoReservas` vive em `DemoSection` (Task 7.11) e
 * é injetada aqui como prop. Isso é o que sustenta a Property 7
 * (Req. 3.2 / 12.9): ao alternar entre as abas Morador ↔ Síndico, o
 * estado da Demo (`areaSelecionada`, `slotSelecionado`,
 * `reservasPorArea`, `ultimaConfirmacao`) precisa ser preservado. Se
 * cada aba criasse sua própria instância do hook, o estado do Morador
 * seria descartado ao entrar no painel do Síndico e voltar.
 *
 * Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.2, 9.1, 9.3, 9.4,
 * 11.1, 11.4, 11.5, 12.9
 */

import { useState } from 'react';
import type { UseDemoReservasReturn } from './useDemoReservas';
import { AREAS } from '@/data/demoConfig';
import type { AreaId } from '@/data/demoConfig';
import { AreaCard } from './components/AreaCard';
import { SlotGrid } from './components/SlotGrid';
import { ConfirmButton } from './components/ConfirmButton';
import { ConfirmMessage } from './components/ConfirmMessage';
import { TimelineProximas } from './components/TimelineProximas';
import { MobileMockup } from './components/MobileMockup';
import { DialogoFluxoMorador } from '@/components/ui/DialogoFluxoMorador';

/** Ordem canônica das áreas exibidas no radiogroup. */
const AREA_ORDER: readonly AreaId[] = ['quadra', 'deck', 'piscina'];

export interface DemoMoradorProps {
  readonly demo: UseDemoReservasReturn;
}

export function DemoMorador({ demo }: DemoMoradorProps): JSX.Element {
  const [fluxoAberto, setFluxoAberto] = useState(false);

  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      {/* Coluna esquerda — Mockup mobile interativo */}
      <MobileMockup>
        <div
          role="radiogroup"
          aria-label="Escolha uma área comum"
          className="grid grid-cols-3 gap-2"
        >
          {AREA_ORDER.map((id) => {
            const area = AREAS[id];
            return (
              <AreaCard
                key={id}
                area={area}
                selecionada={demo.state.areaSelecionada === id}
                onClick={() =>
                  demo.dispatch({ type: 'SELECT_AREA', area: id })
                }
              />
            );
          })}
        </div>

        <SlotGrid
          slotsComStatus={demo.slotsComStatus}
          slotSelecionado={demo.state.slotSelecionado}
          onSelect={(slot) => demo.dispatch({ type: 'SELECT_SLOT', slot })}
        />

        <ConfirmButton
          podeConfirmar={demo.podeConfirmar}
          slotSelecionado={demo.state.slotSelecionado}
          fim={demo.fimDaReservaSelecionada}
          onConfirm={() => demo.dispatch({ type: 'CONFIRM' })}
        />

        <ConfirmMessage ultimaConfirmacao={demo.state.ultimaConfirmacao} />
      </MobileMockup>

      {/* Coluna direita — Narrativa de vendas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Reservas em 3 toques
        </h3>
        <p className="text-sm text-text-secondary">
          Teste você mesmo: escolha uma área, toque no horário e confirme. Toda
          a lógica (limites de horário, bloqueios da Piscina, regra de 2h na
          Quadra) já está no app. O síndico não precisa aprovar nada.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border-primary bg-bg-secondary p-3">
            <p className="text-2xl font-bold text-text-primary">2h</p>
            <p className="text-xs text-text-secondary">
              Limite por casa na quadra
            </p>
          </div>
          <div className="rounded-md border border-border-primary bg-bg-secondary p-3">
            <p className="text-2xl font-bold text-text-primary">24/7</p>
            <p className="text-xs text-text-secondary">
              Disponível dia e noite
            </p>
          </div>
        </div>

        <TimelineProximas />

        <button
          type="button"
          onClick={() => setFluxoAberto(true)}
          className="inline-flex items-center gap-1 text-sm font-medium text-text-info hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        >
          Ver fluxo completo ↗
        </button>

        <DialogoFluxoMorador
          open={fluxoAberto}
          onClose={() => setFluxoAberto(false)}
        />
      </div>
    </div>
  );
}

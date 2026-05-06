/**
 * src/features/demo/components/sindico/MapaOcupacao.tsx — Mapa de
 * ocupação em tempo real do painel do Síndico.
 *
 * Preserva a visualização do HTML original: três linhas horizontais,
 * uma por Area_Comum (Quadra, Deck, Piscina), cada uma com uma
 * sequência de faixas coloridas representando blocos de 2h e rótulos
 * de extremidade ("08h", "14h", "22h").
 *
 * Para o MVP, o conteúdo do mapa é estático: reflete uma fotografia
 * plausível do dia (3 reservas na Quadra, 2 no Deck, Piscina em
 * manutenção), o suficiente para comunicar visualmente a capacidade
 * do produto. Uma versão futura pode derivar os blocos a partir de
 * `useDemoReservas` para ficar ao vivo.
 *
 * Cores:
 *   - `bg-bg-tertiary`    — slot livre
 *   - `bg-accent-primary` — slot reservado/ocupado (verde de marca)
 *   - `bg-text-info`      — reservas futuras (azul)
 *
 * Requirements: 3.11, 10.6, 11.3
 */

export function MapaOcupacao(): JSX.Element {
  return (
    <section
      aria-labelledby="mapa-titulo"
      className="rounded-md border border-border-primary bg-bg-secondary p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3
            id="mapa-titulo"
            className="text-sm font-semibold text-text-primary"
          >
            Ocupação em tempo real
          </h3>
          <p className="text-xs text-text-secondary">
            Atualiza a cada 30 segundos
          </p>
        </div>
        <span className="text-xs text-text-secondary">Hoje · 14:30</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Quadra de Vôlei */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Quadra de Vôlei
            </span>
            <span className="text-xs text-text-secondary">
              3 reservas hoje · 6h ocupadas
            </span>
          </div>
          <div className="flex h-6 gap-[1px] overflow-hidden rounded">
            <div
              className="flex-1 bg-bg-tertiary"
              title="08–10 livre"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-accent-primary"
              title="10–12 Casa 134"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-bg-tertiary"
              title="12–14 livre"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-accent-primary"
              title="14–16 Casa 247"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-accent-primary"
              title="16–18 ocupada"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-bg-tertiary"
              title="18–20 livre"
              aria-hidden="true"
            />
            <div
              className="flex-1 bg-text-info"
              title="20–22 Casa 401"
              aria-hidden="true"
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-text-tertiary">
            <span>08h</span>
            <span>14h</span>
            <span>22h</span>
          </div>
        </div>

        {/* Deck e Salão */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Deck e Salão
            </span>
            <span className="text-xs text-text-secondary">
              2 reservas hoje
            </span>
          </div>
          <div className="flex h-6 gap-[1px] overflow-hidden rounded">
            <div
              className="flex-1 bg-bg-tertiary"
              aria-hidden="true"
              title="08–12 livre"
            />
            <div
              className="flex-1 bg-bg-tertiary"
              aria-hidden="true"
              title="12–14 livre"
            />
            <div
              className="flex-1 bg-text-info"
              aria-hidden="true"
              title="14–16 reservado"
            />
            <div
              className="flex-1 bg-text-info"
              aria-hidden="true"
              title="16–18 reservado"
            />
            <div
              className="flex-1 bg-bg-tertiary"
              aria-hidden="true"
              title="18–20 livre"
            />
            <div
              className="flex-1 bg-bg-tertiary"
              aria-hidden="true"
              title="20–22 livre"
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-text-tertiary">
            <span>08h</span>
            <span>14h</span>
            <span>22h</span>
          </div>
        </div>

        {/* Piscina */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Piscina
            </span>
            <span className="text-xs text-text-secondary">
              Informativa · Fechada hoje
            </span>
          </div>
          <div className="flex h-6 items-center justify-center gap-[1px] overflow-hidden rounded bg-bg-tertiary text-[10px] uppercase tracking-wider text-text-tertiary">
            Fechada hoje
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-text-tertiary">
            <span>08h</span>
            <span>14h</span>
            <span>22h</span>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-4 border-t border-border-primary pt-3">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm bg-bg-tertiary"
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">Livre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm bg-accent-primary"
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm bg-text-info"
            aria-hidden="true"
          />
          <span className="text-xs text-text-secondary">Reserva futura</span>
        </div>
      </div>
    </section>
  );
}

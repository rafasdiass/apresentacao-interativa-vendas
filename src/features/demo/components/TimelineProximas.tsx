/**
 * src/features/demo/components/TimelineProximas.tsx — Timeline "Suas
 * próximas reservas" do Morador.
 *
 * Lista estática das três próximas reservas do morador, preservando o
 * layout do HTML original: cada item é uma linha com barra colorida à
 * esquerda e texto em duas colunas (horário · área).
 *
 * Os dados são hardcoded aqui porque trata-se de um mockup visual — o
 * histórico real de reservas do morador autenticado viria do backend e
 * está fora do escopo do MVP da Demo. Manter os três itens aqui evita
 * inflar `demoConfig.ts` com dados que só este componente consome.
 *
 * Três variações de cor de borda lateral, alinhadas aos tokens:
 *   - `border-accent-primary` (verde) — reserva mais próxima / hoje.
 *   - `border-text-info` (azul) — reserva de amanhã.
 *   - `border-accent-secondary` (amarelo) — reserva futura.
 *
 * Requirements: 11.4
 */

interface ItemTimeline {
  readonly quando: string;
  readonly area: string;
  readonly corBorda: string;
}

const ITENS: readonly ItemTimeline[] = [
  { quando: 'Hoje, 14:00', area: 'Quadra de Vôlei', corBorda: 'border-accent-primary' },
  { quando: 'Amanhã, 09:00', area: 'Deck', corBorda: 'border-text-info' },
  { quando: 'Sexta, 16:00', area: 'Quadra', corBorda: 'border-accent-secondary' },
];

export function TimelineProximas(): JSX.Element {
  return (
    <section aria-labelledby="proximas-titulo">
      <h3
        id="proximas-titulo"
        className="mb-2 text-sm font-semibold text-text-primary"
      >
        Suas próximas reservas
      </h3>
      <ul className="space-y-2">
        {ITENS.map((item) => (
          <li
            key={`${item.quando}-${item.area}`}
            className={`border-l-4 ${item.corBorda} rounded-sm bg-bg-secondary px-3 py-2 text-sm`}
          >
            <span className="font-medium text-text-primary">{item.quando}</span>
            <span className="text-text-secondary"> — {item.area}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * src/features/demo/components/sindico/UltimasReservas.tsx — Lista das
 * reservas mais recentes exibida no painel do Síndico.
 *
 * Renderiza 4 entradas vindas de {@link ULTIMAS_RESERVAS_MOCK} (Task
 * 3.1) no formato `Casa XXX · Área  |  tempoRelativo`. Preserva a
 * estrutura textual do HTML original, agora como `<ul>` semântica com
 * heading associado via `aria-labelledby` para ser anunciado
 * corretamente por leitores de tela.
 *
 * Puramente estático — nenhuma prop, nenhum estado.
 *
 * Requirements: 3.11, 11.2
 */

import { ULTIMAS_RESERVAS_MOCK } from '@/data/demoConfig';

export function UltimasReservas(): JSX.Element {
  return (
    <section
      aria-labelledby="ultimas-titulo"
      className="rounded-md border border-border-primary bg-bg-secondary p-4"
    >
      <h3
        id="ultimas-titulo"
        className="mb-3 text-sm font-semibold text-text-primary"
      >
        Últimas reservas
      </h3>
      <ul className="flex flex-col gap-2">
        {ULTIMAS_RESERVAS_MOCK.map((r) => (
          <li
            key={`${r.casa}-${r.tempoRelativo}`}
            className="flex justify-between text-xs"
          >
            <span>
              <span className="font-medium text-text-primary">{r.casa}</span> ·{' '}
              {r.area}
            </span>
            <span className="text-text-secondary">{r.tempoRelativo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

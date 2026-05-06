/**
 * src/components/sections/DiferenciaisSection.tsx — Seção "Por que essa proposta".
 *
 * Fecha o argumento persuasivo antes do bloco de aceite, combinando três
 * elementos pensados como técnicas de vendas consultivas:
 *
 *   1. **Grid de diferenciais** (Req. 4.7): lê `proposta.diferenciais`
 *      (Task 2.1) e renderiza as 3 strings como cards numerados 01/02/03.
 *      O texto original de cada diferencial vem em formato
 *      `"Título — corpo com detalhe"`. Dividimos no primeiro em-dash e
 *      promovemos o título a cabeçalho em negrito — o em-dash é descartado
 *      por `split('—')`, e o restante é rejoin-ado com o mesmo separador
 *      caso o corpo contenha outro em-dash (texto do diferencial #3 tem).
 *
 *   2. **Bloco de ROI quantificado** (Req. 4.3): dois stat cards lado a
 *      lado com métricas traduzíveis em tempo e dinheiro — horas/mês
 *      economizadas do síndico e da portaria com o agendamento
 *      automatizado, e zero conflitos de reserva graças ao unique
 *      constraint + lock otimista descritos em `DialogoArquiteturaBackend`.
 *
 *   3. **Bloco de prova social** (Req. 4.4): card "Credenciais técnicas"
 *      com 3 bullets citando stacks consolidadas (NestJS/Ionic Capacitor
 *      em produção em empresas conhecidas), garantias de concorrência do
 *      banco, e diferencial de time local em Fortaleza. Termina com um
 *      CTA "Detalhes técnicos" que abre `DialogoArquiteturaBackend` —
 *      substitui o botão `sendPrompt(...)` indefinido do HTML original.
 *
 * Requirements: 4.3, 4.4, 4.7
 */

import { useState } from 'react';
import { proposta } from '@/data/proposta';
import { DialogoArquiteturaBackend } from '@/components/ui/DialogoArquiteturaBackend';

/**
 * Divide uma string de diferencial (formato `"Título — corpo"`) em duas
 * partes. Se a string não contiver em-dash, o corpo fica vazio e o título
 * recebe o texto inteiro — degradação graciosa, nunca erro em runtime.
 */
function separarTituloCorpo(diferencial: string): {
  titulo: string;
  corpo: string;
} {
  const [primeiro, ...resto] = diferencial.split('—');
  const titulo = (primeiro ?? diferencial).trim();
  const corpo = resto.join('—').trim();
  return { titulo, corpo };
}

export function DiferenciaisSection(): JSX.Element {
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);

  return (
    <section
      id="diferenciais"
      aria-labelledby="diferenciais-titulo"
      className="bg-bg-secondary px-4 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            Diferenciais
          </p>
          <h2
            id="diferenciais-titulo"
            className="mt-1 font-heading text-3xl font-bold text-text-primary"
          >
            Por que essa proposta
          </h2>
        </header>

        {/* Grid de 3 cards numerados — Req. 4.7 */}
        <div className="grid gap-4 md:grid-cols-3">
          {proposta.diferenciais.map((diferencial, index) => {
            const { titulo, corpo } = separarTituloCorpo(diferencial);
            const numero = String(index + 1).padStart(2, '0');
            return (
              <article
                key={titulo}
                className="flex flex-col rounded-md border border-border-primary bg-bg-primary p-5"
              >
                <span
                  aria-hidden="true"
                  className="mb-3 font-heading text-3xl font-bold text-accent-primary"
                >
                  {numero}
                </span>
                <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                  {titulo}
                </h3>
                <p className="text-sm text-text-secondary">{corpo}</p>
              </article>
            );
          })}
        </div>

        {/* Bloco de ROI quantificado — Req. 4.3 */}
        <section
          aria-labelledby="roi-titulo"
          className="rounded-md border border-border-primary bg-bg-primary p-6"
        >
          <header className="mb-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">
              Retorno estimado
            </p>
            <h3
              id="roi-titulo"
              className="mt-1 font-heading text-xl font-semibold text-text-primary"
            >
              O que o condomínio ganha por mês
            </h3>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-bg-tertiary p-5 text-center">
              <p className="font-heading text-4xl font-bold text-accent-primary tabular-nums">
                ~12h/mês
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Horas economizadas do síndico e da portaria com agendamento
                automatizado.
              </p>
            </div>
            <div className="rounded-md bg-bg-tertiary p-5 text-center">
              <p className="font-heading text-4xl font-bold text-accent-primary tabular-nums">
                0 conflitos
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Nenhuma reserva duplicada graças ao unique constraint + lock
                otimista.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco de prova social — Req. 4.4 */}
        <section
          aria-labelledby="prova-social-titulo"
          className="rounded-md border border-border-primary bg-bg-primary p-6"
        >
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-text-tertiary">
                Prova social
              </p>
              <h3
                id="prova-social-titulo"
                className="mt-1 font-heading text-xl font-semibold text-text-primary"
              >
                Credenciais técnicas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setArquiteturaAberta(true)}
              className="self-start rounded-md border border-border-primary bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 sm:self-auto"
            >
              Detalhes técnicos
            </button>
          </header>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                Stack consolidada: NestJS (usada por Adidas, Capgemini, Roche)
                + Ionic Capacitor (usada pelo The Economist, MarketWatch).
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                PostgreSQL com unique constraints e lock otimista garantem
                zero double-booking mesmo com 520 moradores concorrentes.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-accent-primary">
                ·
              </span>
              <span>
                Equipe sênior local em Fortaleza — menor custo de comunicação,
                fuso idêntico, reuniões ao vivo se necessário.
              </span>
            </li>
          </ul>
        </section>
      </div>

      <DialogoArquiteturaBackend
        open={arquiteturaAberta}
        onClose={() => setArquiteturaAberta(false)}
      />
    </section>
  );
}

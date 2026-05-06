/**
 * src/components/sections/AceiteSection.tsx — Seção final de aceite.
 *
 * Fecha a jornada linear da Apresentacao com três CTAs (Req. 6.1):
 *
 *   1. **Aceitar proposta** — abre modal com o formulário `AceiteForm`
 *      (Task 11). Se `VITE_FORMSPREE_ENDPOINT` não estiver configurado:
 *        - Em produção, o botão colapsa graciosamente para um CTA de
 *          WhatsApp (Task 11.4) — evitamos montar um form que não tem
 *          para onde submeter.
 *        - Em dev, o botão continua abrindo o modal, mas com um banner
 *          amarelo de aviso explicando como configurar `.env.local`.
 *
 *   2. **Falar no WhatsApp** (Req. 6.5) — link `wa.me/<numero>` com
 *      mensagem pré-preenchida em pt-BR. `target="_blank"` +
 *      `rel="noopener noreferrer"` abre em nova aba sem expor a
 *      referência de `window.opener`.
 *
 *   3. **Baixar PDF da proposta** (Req. 6.6) — `<a download>` apontando
 *      para `/proposta-app-condominio.pdf`. O arquivo será hospedado em
 *      `public/` na Task 12.6.
 *
 * Requirements: 6.1, 6.5, 6.6, 6.7
 */

import { useState } from 'react';
import { proposta } from '@/data/proposta';
import { Modal } from '@/components/ui/Modal';
import { AceiteForm, getAceiteEndpoint } from '@/features/aceite/AceiteForm';

/**
 * Constrói a URL `wa.me/<numero>?text=<mensagem>` a partir do número de
 * contato configurado em `proposta.ts`. `wa.me` exige dígitos puros
 * (sem `+`, espaços ou parênteses); a mensagem é encodada com
 * `encodeURIComponent` para preservar acentos e pontuação.
 */
function montarLinkWhatsApp(numero: string): string {
  const digits = numero.replace(/\D/g, '');
  const texto =
    'Olá Lavita Code, quero avançar com a proposta do App Condomínio Digital.';
  return `https://wa.me/${digits}?text=${encodeURIComponent(texto)}`;
}

export function AceiteSection(): JSX.Element {
  const [aceiteAberto, setAceiteAberto] = useState(false);
  const linkWhatsApp = montarLinkWhatsApp(proposta.contato.whatsappNumero);

  const endpoint = getAceiteEndpoint();
  const isDev = import.meta.env.DEV;
  // Em produção sem endpoint: botão "Aceitar" vira CTA para WhatsApp
  // (Task 11.4). Em dev, deixamos o fluxo aberto para que o dev possa
  // validar a UI mesmo antes de configurar `.env.local`.
  const aceiteIndisponivel = !endpoint && !isDev;

  return (
    <section
      id="aceite"
      aria-labelledby="aceite-titulo"
      className="bg-surface-dark px-4 py-16 text-text-on-dark"
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-wider opacity-70">
            Aceite da proposta
          </p>
          <h2
            id="aceite-titulo"
            className="mt-1 font-heading text-3xl font-bold md:text-4xl"
          >
            Pronto para começar?
          </h2>
          <p className="mt-3 text-base opacity-80">
            Três caminhos rápidos para avançar agora:
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {/* CTA 1 — Aceitar proposta (abre formulário) */}
          <article className="flex flex-col gap-3 rounded-md border border-white/20 bg-white/5 p-5">
            <h3 className="font-heading text-lg font-semibold">
              Aceitar proposta
            </h3>
            <p className="flex-1 text-sm opacity-80">
              {aceiteIndisponivel
                ? 'Endpoint de aceite não configurado — use o WhatsApp para avançar agora.'
                : 'Preencha seus dados e registre o aceite com um clique. Nós retornamos em até 1 dia útil com o contrato.'}
            </p>
            {aceiteIndisponivel ? (
              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-accent-primary px-4 py-2 text-center font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
              >
                Falar no WhatsApp
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setAceiteAberto(true)}
                className="rounded-md bg-accent-primary px-4 py-2 font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
              >
                Aceitar proposta
              </button>
            )}
          </article>

          {/* CTA 2 — Falar no WhatsApp */}
          <article className="flex flex-col gap-3 rounded-md border border-white/20 bg-white/5 p-5">
            <h3 className="font-heading text-lg font-semibold">
              Falar no WhatsApp
            </h3>
            <p className="flex-1 text-sm opacity-80">
              Tem alguma dúvida antes de avançar? Fale direto com o
              desenvolvedor em uma conversa curta.
            </p>
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/30 bg-transparent px-4 py-2 text-center font-semibold text-text-on-dark hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              Falar no WhatsApp
            </a>
          </article>

          {/* CTA 3 — Baixar PDF */}
          <article className="flex flex-col gap-3 rounded-md border border-white/20 bg-white/5 p-5">
            <h3 className="font-heading text-lg font-semibold">
              Baixar PDF da proposta
            </h3>
            <p className="flex-1 text-sm opacity-80">
              Prefere revisar offline ou compartilhar internamente? Baixe a
              versão em PDF.
            </p>
            <a
              href="/proposta-comercial.pdf"
              download
              className="rounded-md border border-white/30 bg-transparent px-4 py-2 text-center font-semibold text-text-on-dark hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              Baixar PDF da proposta
            </a>
          </article>
        </div>
      </div>

      <Modal
        open={aceiteAberto}
        onClose={() => setAceiteAberto(false)}
        title="Aceitar proposta"
      >
        {!endpoint && isDev && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-status-warning bg-status-warning/10 p-3 text-xs text-text-primary"
          >
            <p className="font-semibold text-status-warning">
              VITE_FORMSPREE_ENDPOINT não está configurado.
            </p>
            <p className="mt-1">
              Adicione o endpoint do Formspree em <code>.env.local</code> para
              ativar o envio real. O formulário abaixo ainda valida os campos,
              mas a submissão falhará.
            </p>
          </div>
        )}
        <AceiteForm
          endpoint={endpoint ?? ''}
          onSuccess={() => {
            // Mantém o modal aberto para exibir o banner de sucesso do form.
            // Caller não precisa reagir agora; futura telemetria pode entrar aqui.
          }}
        />
      </Modal>
    </section>
  );
}

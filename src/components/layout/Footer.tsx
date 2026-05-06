/**
 * src/components/layout/Footer.tsx — Rodapé global da Apresentacao (Task 12.2).
 *
 * Rodapé minimalista em fundo escuro (`surface-dark`) para fechar o
 * fluxo da página com simetria visual em relação ao Hero (Task 8.1) e
 * ao AceiteSection (Task 8.8). Cumpre o Req. 6.7:
 *
 *   - Nome do desenvolvedor: "Lavita Code", em tipografia de título.
 *   - Contato: `proposta.contato.email` renderizado como `mailto:`
 *     link funcional — um toque abre o cliente de e-mail do Cliente.
 *   - Política de privacidade: link para `/privacidade.html`
 *     (placeholder estático hospedado em `public/` antes do deploy;
 *     ainda não criado neste MVP — cai em 404 graciosamente, o link
 *     continua anunciado pelo leitor de tela).
 *
 * `role="contentinfo"` é o landmark ARIA oficial para rodapés de
 * página; explícito para ferramentas antigas que não inferem o
 * landmark do elemento `<footer>`.
 *
 * Layout: flex coluna em mobile, linha em `md:` (≥ 768px), com o
 * nome à esquerda e contato+privacidade à direita. `max-w-6xl`
 * alinha com o `NavBar` e as seções de conteúdo.
 *
 * Requirements: 6.7
 */

import { proposta } from '@/data/proposta';

export function Footer(): JSX.Element {
  return (
    <footer
      role="contentinfo"
      className="bg-surface-dark px-4 py-8 text-text-on-dark"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-heading text-sm font-semibold">Lavita Code</p>
        <p className="text-xs opacity-70">
          E-mail:{' '}
          <a
            href={`mailto:${proposta.contato.email}`}
            className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
          >
            {proposta.contato.email}
          </a>
        </p>
      </div>
    </footer>
  );
}

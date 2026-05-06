/**
 * src/components/sections/Hero.tsx — Seção de abertura (hero) da Apresentacao.
 *
 * Primeira seção visível ao Cliente: aplica a técnica de vendas do Req. 4.1
 * (proposta de valor de uma linha + CTA primário) e do Req. 4.7 (destaque
 * do "MVP em uso real a partir da Semana 7" como redução de risco).
 *
 * O hero usa fundo escuro (`surface-dark`) para contrastar visualmente com
 * as seções seguintes em branco / cinza claro; a seção de aceite (Task 8.8)
 * repete o tom escuro para fechar a jornada com simetria visual.
 *
 * Os CTAs são âncoras HTML nativas (`<a href="#demo">` / `<a href="#investimento">`).
 * Nenhum JavaScript de scroll é necessário aqui: o global CSS `html { scroll-
 * behavior: smooth }` em `src/index.css` trata o scroll suave e respeita
 * `prefers-reduced-motion` automaticamente.
 *
 * Requirements: 4.1, 4.7, 1.1
 */

export function Hero(): JSX.Element {
  return (
    <section
      id="hero"
      aria-labelledby="hero-titulo"
      className="bg-surface-dark px-4 py-24 text-text-on-dark"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-wider opacity-70">
          App Condomínio Digital — Proposta Lavita Code
        </p>
        <h1
          id="hero-titulo"
          className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl"
        >
          Tire 520 unidades do WhatsApp em 10 semanas
        </h1>
        <p className="mt-4 text-lg opacity-80">
          MVP em uso real a partir da Semana 7. Apps iOS e Android para
          moradores + painel administrativo para o síndico, com automação
          total das regras de uso das áreas comuns.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#investimento"
            className="rounded-md bg-accent-primary px-6 py-3 font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
          >
            Ver proposta
          </a>
          <a
            href="#demo"
            className="rounded-md border border-white/30 px-6 py-3 font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
          >
            Ver demo
          </a>
        </div>
      </div>
    </section>
  );
}

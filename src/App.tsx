/**
 * src/App.tsx — Raiz da Apresentacao (Task 12.3).
 *
 * Compõe, em uma única árvore, os três eixos da aplicação:
 *
 *   1. **Modo Apresentador (PresenterProvider)** — envolve tudo para
 *      que qualquer descendente possa consumir `usePresenter()` sem
 *      prop-drilling. Lê `?modo=apresentador` uma única vez no mount
 *      (Req. 7.1) e expõe controles de navegação + cópia de link.
 *
 *   2. **Chrome global (Layout)** — NavBar, CTAFloating,
 *      ScrollReminderToast e Footer. Recebe as 8 seções como
 *      `children` e cuida do scroll-spy (Req. 1.4) e da visibilidade
 *      dos CTAs persistentes (Req. 4.5, 4.6).
 *
 *   3. **Seções de conteúdo** — renderizadas na ordem canônica de
 *      `SECOES` (navegacao.ts): hero → demo → escopo → cronograma →
 *      investimento → benchmarking → diferenciais → aceite. A Property
 *      9 (Task 12.4) verifica que cada `id` existe no DOM após o render.
 *
 * `PresenterControls` fica **fora** do `Layout` mas **dentro** do
 * `PresenterProvider` — é um painel fixo que não deve ser envolto pelo
 * `<main>` semântico (não é conteúdo principal, é ferramenta do
 * Vendedor). Retorna `null` em modo Cliente, então não polui o DOM.
 *
 * Requirements: 1.1, 1.2, 7.1, 10.2
 */

import { PresenterProvider } from '@/features/presenter/PresenterContext';
import { PresenterControls } from '@/features/presenter/PresenterControls';
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/sections/Hero';
import { DemoSection } from '@/features/demo/DemoSection';
import { EscopoSection } from '@/components/sections/EscopoSection';
import { CronogramaSection } from '@/components/sections/CronogramaSection';
import { InvestimentoSection } from '@/components/sections/InvestimentoSection';
import { BenchmarkSection } from '@/components/sections/BenchmarkSection';
import { DiferenciaisSection } from '@/components/sections/DiferenciaisSection';
import { AceiteSection } from '@/components/sections/AceiteSection';

function App(): JSX.Element {
  return (
    <PresenterProvider>
      <Layout>
        <Hero />
        <DemoSection />
        <EscopoSection />
        <CronogramaSection />
        <InvestimentoSection />
        <BenchmarkSection />
        <DiferenciaisSection />
        <AceiteSection />
      </Layout>
      <PresenterControls />
    </PresenterProvider>
  );
}

export default App;

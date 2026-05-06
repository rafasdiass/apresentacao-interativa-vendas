/**
 * src/features/demo/DemoSection.tsx — Raiz da feature Demo interativa.
 *
 * É o ponto de integração único das abas Morador e Síndico. Três
 * responsabilidades:
 *
 *   1. **Possuir a instância compartilhada de `useDemoReservas`**.
 *      Uma única instância do hook é criada aqui e passada como prop
 *      para `DemoMorador` e `DemoSindico`. Isso sustenta a Property 7
 *      (Req. 3.2 / 12.9): alternar para a aba Síndico e voltar para a
 *      aba Morador **preserva** `areaSelecionada`, `slotSelecionado`,
 *      `reservasPorArea` e `ultimaConfirmacao`. Se cada aba possuísse
 *      sua própria instância, o estado seria descartado na primeira
 *      alternância.
 *
 *   2. **Renderizar o cabeçalho da seção** alinhado com a Proposta —
 *      stack sem versões específicas (corrige Bug #11: HTML original
 *      listava "Ionic 8 + Angular 17"; a Proposta cita apenas "Ionic
 *      + NestJS").
 *
 *   3. **Amarrar `DemoTabs` ao painel** (`aria-controls` /
 *      `aria-labelledby` via IDs `painel-morador` / `painel-sindico`),
 *      atribuindo `role="tabpanel"` ao conteúdo ativo. Os IDs de tab
 *      correspondentes (`tab-morador`, `tab-sindico`) são gerados por
 *      `DemoTabs`.
 *
 * Renderização condicional: em vez de renderizar os dois painéis com
 * `hidden`, monta apenas o ativo. Isso é seguro porque o estado da
 * Demo vive fora dos componentes (no hook) — desmontar `DemoSindico`
 * não perde nada, e evita o custo de renderizar um mapa/lista que o
 * usuário não está vendo.
 *
 * Requirements: 3.1, 3.2, 11.5, 12.9
 */

import { DemoMorador } from './DemoMorador';
import { DemoSindico } from './DemoSindico';
import { DemoTabs } from './DemoTabs';
import { useDemoReservas } from './useDemoReservas';

export function DemoSection(): JSX.Element {
  const demo = useDemoReservas();

  return (
    <section
      id="demo"
      aria-labelledby="demo-titulo"
      className="bg-bg-primary px-4 py-16"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wider text-text-tertiary">
            Demonstração interativa
          </p>
          <h2
            id="demo-titulo"
            className="mt-1 font-heading text-3xl font-bold text-text-primary"
          >
            Teste o aplicativo agora
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            App Condomínio Digital · 520 unidades · Ionic + NestJS · iOS &amp;
            Android
          </p>
        </header>

        <DemoTabs
          view={demo.state.view}
          onSwitch={(view) => demo.dispatch({ type: 'SWITCH_VIEW', view })}
        />

        <div
          role="tabpanel"
          id={`painel-${demo.state.view}`}
          aria-labelledby={`tab-${demo.state.view}`}
        >
          {demo.state.view === 'morador' ? (
            <DemoMorador demo={demo} />
          ) : (
            <DemoSindico demo={demo} />
          )}
        </div>
      </div>
    </section>
  );
}

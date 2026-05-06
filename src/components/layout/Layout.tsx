/**
 * src/components/layout/Layout.tsx — Chrome global da Apresentacao (Task 12.1).
 *
 * Componente de layout de topo que monta todos os elementos
 * **cross-section** (nav, CTAs persistentes, toast, rodapé) em volta
 * do `children` de conteúdo (as 8 seções renderizadas por `App.tsx`).
 * Isso mantém `App.tsx` enxuto e concentra aqui a lógica de scroll
 * position + scroll-spy + estado de dismissal do toast.
 *
 * Responsabilidades:
 *
 *   1. **Scroll-spy** (Req. 1.4): invoca `useActiveSection(SECOES)`
 *      para descobrir qual seção está no viewport e passa o `activeId`
 *      para a `NavBar`.
 *
 *   2. **Rastreamento de posição de scroll**: mantém `scrollY` e
 *      `docHeight` em state, atualizados via listeners `scroll` +
 *      `resize` com `{ passive: true }` para não bloquear o main
 *      thread. O `resize` é incluído porque `document.documentElement.
 *      scrollHeight` pode mudar quando imagens carregam ou o usuário
 *      rotaciona o dispositivo — sem ele, o threshold do toast fica
 *      esticado indefinidamente após reflow.
 *
 *   3. **Visibilidade do `CTAFloating`** (Req. 4.5, 12.5): visível
 *      quando o usuário rolou > 100vh **E** a seção ativa não é
 *      `#aceite`. Se já está olhando o bloco de aceite, o CTA flutuante
 *      seria redundante sobre os CTAs da própria seção — ocultamos.
 *
 *   4. **Visibilidade do `ScrollReminderToast`** (Req. 4.6): aparece
 *      quando o usuário passou de 70% do documento **E** ainda não
 *      dismissou o toast. O dismissal vive apenas em memória (Req. 4.6:
 *      "sessão guardada em memória; não persiste recarregamento"),
 *      então recarregar a página mostra o toast novamente.
 *
 * Guards para SSR/jsdom: o primeiro cálculo de `scrollY`/`docHeight`
 * acontece **dentro** do `useEffect` — antes do primeiro scroll, os
 * dois valores são 0, o que naturalmente desliga o CTA e o toast.
 * Também guardamos `typeof window !== 'undefined'` no cálculo derivado
 * de `ctaVisible` para que o componente não crashe se for renderizado
 * em um ambiente sem `window.innerHeight`.
 *
 * Requirements: 9.4, 4.5, 4.6
 */

import { useEffect, useState, type ReactNode } from 'react';
import { NavBar } from './NavBar';
import { CTAFloating } from './CTAFloating';
import { ScrollReminderToast } from './ScrollReminderToast';
import { Footer } from './Footer';
import { SECOES } from '@/data/navegacao';
import { useActiveSection } from '@/hooks/useActiveSection';

export interface LayoutProps {
  readonly children: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const activeId = useActiveSection(SECOES);

  // Rastreia posição de scroll para decidir visibilidade do CTAFloating
  // e do ScrollReminderToast.
  const [scrollY, setScrollY] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  const [toastDismissed, setToastDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = (): void => {
      setScrollY(window.scrollY);
      setDocHeight(
        document.documentElement.scrollHeight - window.innerHeight,
      );
    };
    // Popula o estado inicial com valores reais na primeira montagem —
    // antes disso o useState começa em 0, o que é seguro mas inexato.
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // CTAFloating: visível após scrollar > 100vh E quando o aceite não
  // está em vista. `typeof window` guard evita crash em jsdom caso o
  // render aconteça antes de qualquer efeito.
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 0;
  const ctaVisible = scrollY > viewportHeight && activeId !== 'aceite';

  // ScrollReminderToast: aparece após 70% do documento. `docHeight > 0`
  // evita divisão por zero e ignora o caso inicial em que o efeito
  // ainda não rodou.
  const scrolledPastThreshold =
    docHeight > 0 && scrollY / docHeight > 0.7;

  return (
    <>
      <NavBar items={SECOES} activeId={activeId} />
      <main id="main-content" role="main">
        {children}
      </main>
      <Footer />
      <CTAFloating visible={ctaVisible} />
      <ScrollReminderToast
        scrolledPastThreshold={scrolledPastThreshold}
        dismissed={toastDismissed}
        onDismiss={() => setToastDismissed(true)}
      />
    </>
  );
}

/**
 * src/features/demo/components/MobileMockup.tsx — Moldura visual do mockup
 * mobile no qual a Demo do Morador é renderizada.
 *
 * Estrutura rígida de 7 linhas de altura fixa em pixels
 * (`grid-rows-[24px_56px_56px_80px_208px_88px_56px]`) que soma 568px. Somadas
 * aos 72px absorvidos pelo frame (`border-4` + paddings internos), fecham a
 * altura total 640px. As faixas decorativas (linhas 1, 2, 3 e 7) são internas
 * ao mockup — não aceitam props. As linhas 4, 5 e 6 recebem os 4 slots nomeados
 * `areaCards`, `slotArea`, `confirmButton` e `confirmMessage`, cada um ancorado
 * em um contêiner com altura própria. O wrapper `data-testid="confirm-message-slot"`
 * com `h-10` reserva o espaço da mensagem de confirmação antes do conteúdo
 * aparecer, eliminando o reflow vertical do Requisito 9.1.
 *
 * O elemento raiz expõe `data-testid="mobile-mockup"` e o atributo booleano
 * `data-demo-frame` para que os testes de propriedade extraiam a moldura e
 * validem o esqueleto do grid em qualquer estado do reducer (Property 1).
 *
 * Este componente é intencionalmente **puramente visual**: não conhece o
 * estado da Demo, o reducer ou o hook. Todo o polimento estrutural do mockup
 * acontece aqui e nos 4 componentes decorativos internos
 * (`StatusBar`, `AppHeader`, `HighlightBanner`, `BottomTabBar`).
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 1.9, 3.4, 4.6, 5.4, 9.1, 10.1, 10.6, 11.1
 */

import type { ReactNode } from 'react';

import { StatusBar } from './StatusBar';
import { AppHeader } from './AppHeader';
import { HighlightBanner } from './HighlightBanner';
import { BottomTabBar } from './BottomTabBar';

export interface MobileMockupProps {
  readonly areaCards: ReactNode;
  readonly slotArea: ReactNode;
  readonly confirmButton: ReactNode;
  readonly confirmMessage: ReactNode;
}

export function MobileMockup({
  areaCards,
  slotArea,
  confirmButton,
  confirmMessage,
}: MobileMockupProps): JSX.Element {
  return (
    <div
      data-testid="mobile-mockup"
      data-demo-frame=""
      className="mx-auto grid w-[320px] h-[640px] grid-rows-[24px_56px_56px_80px_208px_88px_56px] overflow-hidden rounded-[2rem] border-4 border-gray-900 bg-surface-dark shadow-2xl"
    >
      <StatusBar />
      <AppHeader />
      <HighlightBanner />
      <div className="flex items-center bg-bg-secondary px-4">{areaCards}</div>
      <div
        data-testid="slot-area"
        className="h-52 bg-bg-secondary px-4"
      >
        {slotArea}
      </div>
      <div className="grid grid-rows-[40px_8px_40px] bg-bg-secondary px-4">
        {confirmButton}
        <div aria-hidden="true" />
        <div
          data-testid="confirm-message-slot"
          className="relative h-10"
        >
          {confirmMessage}
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}

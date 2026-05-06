/**
 * src/features/demo/components/StatusBar.tsx — Barra de status decorativa do MobileMockup.
 *
 * Reproduz o visual de uma status bar iOS/Android com horário fixo (`9:41`) e
 * três mini-ícones (sinal celular, Wi-Fi, bateria) à direita. O bloco inteiro é
 * marcado `aria-hidden="true"` — é puro adorno de mockup e não carrega semântica
 * útil para leitores de tela. Altura fixa `h-6` (24px) ancora a primeira faixa do
 * grid do `MobileMockup`.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { SignalIcon } from './icons/SignalIcon';
import { WifiIcon } from './icons/WifiIcon';
import { BatteryIcon } from './icons/BatteryIcon';

export function StatusBar(): JSX.Element {
  return (
    <div
      data-testid="status-bar"
      aria-hidden="true"
      className="flex h-6 items-center justify-between bg-surface-dark px-4 text-[11px] font-semibold text-text-on-dark"
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <SignalIcon className="w-3 h-3" />
        <WifiIcon className="w-3 h-3" />
        <BatteryIcon className="w-3 h-3" />
      </div>
    </div>
  );
}

/**
 * scripts/validate-proposta.ts — Validação de build da Proposta Comercial.
 *
 * Executado pelo hook `prebuild` do `package.json` antes de `vite build`.
 * Importa o literal tipado `proposta` de `src/data/proposta.ts` e a função
 * pura `validarProposta` (Task 2.3), que checa runtime invariants numéricas
 * que o sistema de tipos não consegue expressar — em especial a invariante
 * de totalização (soma dos itens = total declarado).
 *
 * Comportamento:
 * - Sucesso: imprime uma linha curta confirmando a validação e sai com
 *   código 0, permitindo que o `vite build` prossiga.
 * - Falha: imprime a mensagem da `Error` lançada em stderr e sai com
 *   código 1, fazendo o `npm run build` (e, consequentemente, o deploy da
 *   Vercel) falhar imediatamente.
 *
 * Requirements: 2.10, 12.4
 */

import { proposta, validarProposta } from '../src/data/proposta';

try {
  validarProposta(proposta);
  console.log('✓ validate-proposta: invariantes OK');
  process.exit(0);
} catch (err) {
  const mensagem = err instanceof Error ? err.message : String(err);
  console.error(`✗ validate-proposta: ${mensagem}`);
  process.exit(1);
}

/**
 * src/features/aceite/schema.ts — Schema zod de validação do formulário
 * de aceite (Task 11.1).
 *
 * O formulário de aceite (Req. 6.2, 6.4) coleta cinco campos obrigatórios
 * antes de registrar o aceite da Proposta: `nome`, `documento` (CPF ou
 * CNPJ), `email`, `telefone` (padrão brasileiro) e `aceitouTermos` como
 * *literal true*. A escolha por zod é consistente com o design
 * (`design.md > Components and Interfaces > AceiteForm`) e dá três
 * vantagens práticas para o MVP:
 *
 *   1. **Tipo inferido** (`z.infer<typeof aceiteSchema>`) — a UI e o
 *      callback `onSuccess` compartilham exatamente a mesma forma sem
 *      manter uma interface manual que pode divergir do schema.
 *   2. **Mensagens por campo** — zod retorna `flatten().fieldErrors`, um
 *      `Record<campo, string[]>` que o componente mapeia 1:1 para
 *      `aria-describedby`, atendendo Req. 6.4 sem biblioteca extra.
 *   3. **Zero impacto no bundle em produção** — o zod é tree-shakable e
 *      o schema é pequeno; não precisamos de React Hook Form para um
 *      formulário de 5 campos.
 *
 * **Profundidade da validação — decisão deliberada**:
 *
 * Não validamos os *dígitos verificadores* de CPF/CNPJ. O objetivo deste
 * formulário é registrar o aceite comercial e acionar um contato humano
 * depois, não substituir o cadastro oficial. Rejeitar o CPF de testes
 * `123.456.789-00` ou um documento real com typo tornaria a UX mais
 * hostil do que o ganho prático (o Vendedor confirma os dados na
 * conversa seguinte). Portanto, a regex apenas garante contagem e
 * formato: 11 dígitos puros, 14 dígitos puros, ou as formas canônicas
 * com pontuação.
 *
 * O mesmo racional vale para telefone: aceitamos tanto `(85) 98765-4321`
 * quanto `85987654321` — qualquer formato que um cliente brasileiro
 * digite intuitivamente.
 *
 * Requirements: 6.2, 6.4
 */

import { z } from 'zod';

/**
 * CPF (11 dígitos) ou CNPJ (14 dígitos), com ou sem formatação canônica.
 *
 * Aceita:
 *   - `000.000.000-00` (CPF formatado)
 *   - `00.000.000/0000-00` (CNPJ formatado)
 *   - `00000000000` (CPF numérico)
 *   - `00000000000000` (CNPJ numérico)
 *
 * Validação de dígitos verificadores deliberadamente fora do escopo (ver
 * nota do topo do arquivo).
 */
const documentoRegex =
  /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{11}|\d{14})$/;

/**
 * Telefone brasileiro, fixo (10 dígitos) ou móvel (11 dígitos com o 9
 * adicional). Aceita:
 *   - `(85) 98765-4321` / `(85) 3333-4444` (formato canônico com DDD)
 *   - `(85)987654321`
 *   - `85987654321` / `8533334444` (apenas dígitos)
 *
 * Não valida DDD contra lista de DDDs válidos — mesmo raciocínio dos
 * dígitos verificadores acima.
 */
const telefoneRegex = /^(?:\(\d{2}\)\s?\d{4,5}-?\d{4}|\d{10,11})$/;

export const aceiteSchema = z.object({
  nome: z.string().trim().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  documento: z
    .string()
    .trim()
    .regex(documentoRegex, 'Informe um CPF ou CNPJ válido'),
  email: z.string().trim().email('Informe um e-mail válido'),
  telefone: z
    .string()
    .trim()
    .regex(telefoneRegex, 'Informe um telefone brasileiro válido'),
  aceitouTermos: z.literal(true, {
    errorMap: () => ({
      message: 'É necessário aceitar os termos da proposta',
    }),
  }),
});

export type AceiteFormData = z.infer<typeof aceiteSchema>;

/**
 * src/features/aceite/AceiteForm.tsx — Formulário de aceite (Tasks 11.2,
 * 11.3, 11.4).
 *
 * O formulário encerra a jornada comercial: ao submetê-lo, o Cliente
 * registra formalmente o aceite da Proposta e a Lavita Code assume o
 * compromisso de responder em até 1 dia útil com o contrato.
 *
 * **Arquitetura do estado — por que três slices separados**:
 *
 *   1. `form: Record<keyof AceiteFormData, string>` — uma string por campo,
 *      incluindo `aceitouTermos` modelado como `'true' | ''`. Usar strings
 *      uniformes simplifica os handlers (um único `onChange` por tipo) e
 *      a serialização para o payload.
 *   2. `errors: Partial<Record<keyof AceiteFormData, string>>` — mensagens
 *      por campo. Derivadas do `safeParse` via `flatten().fieldErrors`.
 *   3. `status: AceiteStatus` — máquina de estado da submissão, isolada
 *      do form/errors porque seu ciclo de vida é independente: `idle →
 *      submitting → (success | error)`, e um erro preserva os dados já
 *      digitados (Req. 6.3) sem tocar em `form`.
 *
 * **Por que `fetch` nativo em vez de axios/tanstack-query**:
 *
 * Para um único POST sem cache, retries automáticos ou deduplicação, uma
 * lib traz mais peso do que benefício. `AbortController` + `setTimeout`
 * entrega o timeout de 10s do design, e o tratamento de erro é trivial
 * (três caminhos: abort, ok=false, throw).
 *
 * **Contrato de endpoint**:
 *
 * O endpoint vem como prop (`endpoint: string`) para que o componente
 * permaneça testável sem depender de `import.meta.env`. O helper
 * `getAceiteEndpoint()` encapsula a leitura da env var — é o caller
 * (normalmente `AceiteSection`) quem decide se renderiza o formulário ou
 * se colapsa para WhatsApp quando a env não está configurada (Task 11.4).
 *
 * Requirements: 6.2, 6.3, 6.4, 9.3
 */

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { aceiteSchema, type AceiteFormData } from './schema';
import { proposta } from '@/data/proposta';

// ────────────────────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────────────────────

export interface AceiteFormProps {
  readonly endpoint: string;
  readonly onSuccess?: (data: AceiteFormData) => void;
}

export type AceiteStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; at: Date }
  | { kind: 'error'; message: string };

type CampoTexto = 'nome' | 'documento' | 'email' | 'telefone';
type FormState = Record<CampoTexto, string> & { aceitouTermos: boolean };
type ErrorsState = Partial<Record<keyof AceiteFormData, string>>;

// ────────────────────────────────────────────────────────────────────────────
// Constantes
// ────────────────────────────────────────────────────────────────────────────

/** Timeout da chamada POST em milissegundos. Ver design > Error Handling. */
const TIMEOUT_MS = 10_000;

/** Estado inicial — usado no mount e após um sucesso (caso o usuário queira
 * submeter de novo a partir do banner de confirmação). */
const initialForm: FormState = {
  nome: '',
  documento: '',
  email: '',
  telefone: '',
  aceitouTermos: false,
};

// ────────────────────────────────────────────────────────────────────────────
// Helper exportado: leitura da env var
// ────────────────────────────────────────────────────────────────────────────

/**
 * Retorna o endpoint de aceite configurado em `VITE_FORMSPREE_ENDPOINT`
 * ou `undefined` se a variável não estiver definida. É chamado pelo
 * caller (normalmente `AceiteSection`) para decidir entre montar o
 * `AceiteForm` ou colapsar graciosamente para WhatsApp.
 *
 * O componente não lê a env diretamente para que:
 *   - Testes possam injetar um endpoint arbitrário sem `vi.stubEnv`.
 *   - O componente seja reusável caso haja múltiplos endpoints no
 *     futuro (A/B test, fallback para Vercel Function, etc.).
 */
export function getAceiteEndpoint(): string | undefined {
  return import.meta.env.VITE_FORMSPREE_ENDPOINT;
}

// ────────────────────────────────────────────────────────────────────────────
// Helper: montar link WhatsApp (duplicado com AceiteSection para manter o
// componente autônomo no banner de erro)
// ────────────────────────────────────────────────────────────────────────────

function montarLinkWhatsApp(): string {
  const digits = proposta.contato.whatsappNumero.replace(/\D/g, '');
  const texto =
    'Olá Lavita Code, quero avançar com a proposta do App Condomínio Digital.';
  return `https://wa.me/${digits}?text=${encodeURIComponent(texto)}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Componente
// ────────────────────────────────────────────────────────────────────────────

export function AceiteForm({
  endpoint,
  onSuccess,
}: AceiteFormProps): JSX.Element {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorsState>({});
  const [status, setStatus] = useState<AceiteStatus>({ kind: 'idle' });

  // Guarda o AbortController da submissão em andamento. Permite cancelar
  // se o componente desmontar (não montamos o cleanup agora porque o
  // timeout já aborta) e evita vazar o controller entre submits.
  const activeControllerRef = useRef<AbortController | null>(null);

  const handleChangeTexto = (
    campo: CampoTexto,
    valor: string,
  ): void => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    // Limpa o erro do campo assim que o usuário começa a corrigi-lo —
    // feedback imediato é mais útil do que aguardar a próxima submissão.
    if (errors[campo]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[campo];
        return next;
      });
    }
  };

  const handleChangeTermos = (checked: boolean): void => {
    setForm((prev) => ({ ...prev, aceitouTermos: checked }));
    if (errors.aceitouTermos) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.aceitouTermos;
        return next;
      });
    }
  };

  const resetarSubmissao = (): void => {
    setStatus({ kind: 'idle' });
  };

  const submeter = async (): Promise<void> => {
    const result = aceiteSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: ErrorsState = {};
      (Object.keys(fieldErrors) as Array<keyof AceiteFormData>).forEach(
        (campo) => {
          const msgs = fieldErrors[campo];
          const first = msgs?.[0];
          if (first) {
            mapped[campo] = first;
          }
        },
      );
      setErrors(mapped);
      return;
    }

    setErrors({});
    setStatus({ kind: 'submitting' });

    const controller = new AbortController();
    activeControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(result.data),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Servidor respondeu ${response.status}. Tente novamente em instantes.`,
        );
      }

      setStatus({ kind: 'success', at: new Date() });
      onSuccess?.(result.data);
    } catch (err: unknown) {
      // `AbortError` (timeout) e erros de rede viram o mesmo status de erro
      // — do ponto de vista do Cliente a ação prática é a mesma (tentar de
      // novo ou falar no WhatsApp). Mas a mensagem é adaptada.
      let message: string;
      if (err instanceof DOMException && err.name === 'AbortError') {
        message =
          'A conexão demorou demais. Verifique sua internet e tente novamente.';
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = 'Não foi possível enviar o aceite. Tente novamente.';
      }
      setStatus({ kind: 'error', message });
    } finally {
      clearTimeout(timeoutId);
      activeControllerRef.current = null;
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void submeter();
  };

  // ────────────────────────────────────────────────────────────────────────
  // Tela de sucesso — substitui totalmente o form
  // ────────────────────────────────────────────────────────────────────────

  if (status.kind === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-status-positive bg-status-positive/10 p-4 text-text-primary"
      >
        <p className="font-semibold text-status-positive">
          Aceite registrado em {status.at.toLocaleString('pt-BR')}.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Obrigado! A Lavita Code entrará em contato em até 1 dia útil com o
          contrato e os próximos passos.
        </p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // Form principal (idle | submitting | error)
  // ────────────────────────────────────────────────────────────────────────

  const inputBase =
    'block w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-1 disabled:opacity-60';
  const erroBase = 'mt-1 text-xs text-status-negative';
  const isSubmitting = status.kind === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Banner de erro — renderizado acima dos campos quando relevante */}
      {status.kind === 'error' && (
        <div
          role="alert"
          className="rounded-md border border-status-negative bg-status-negative/10 p-3 text-sm text-status-negative"
        >
          <p className="font-semibold">Não foi possível enviar o aceite.</p>
          <p className="mt-1 text-xs">{status.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetarSubmissao();
                void submeter();
              }}
              className="rounded-md bg-status-negative px-3 py-1.5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Tentar novamente
            </button>
            <a
              href={montarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-status-negative px-3 py-1.5 text-xs font-semibold text-status-negative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Nome */}
      <div>
        <label
          htmlFor="aceite-nome"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          Nome completo
        </label>
        <input
          id="aceite-nome"
          type="text"
          autoComplete="name"
          value={form.nome}
          onChange={(e) => handleChangeTexto('nome', e.target.value)}
          aria-invalid={errors.nome ? true : undefined}
          aria-describedby={errors.nome ? 'aceite-nome-error' : undefined}
          disabled={isSubmitting}
          className={inputBase}
        />
        {errors.nome && (
          <p id="aceite-nome-error" className={erroBase}>
            {errors.nome}
          </p>
        )}
      </div>

      {/* Documento */}
      <div>
        <label
          htmlFor="aceite-documento"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          CPF ou CNPJ
        </label>
        <input
          id="aceite-documento"
          type="text"
          autoComplete="off"
          value={form.documento}
          onChange={(e) => handleChangeTexto('documento', e.target.value)}
          aria-invalid={errors.documento ? true : undefined}
          aria-describedby={
            errors.documento ? 'aceite-documento-error' : undefined
          }
          disabled={isSubmitting}
          className={inputBase}
        />
        {errors.documento && (
          <p id="aceite-documento-error" className={erroBase}>
            {errors.documento}
          </p>
        )}
      </div>

      {/* E-mail */}
      <div>
        <label
          htmlFor="aceite-email"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          E-mail
        </label>
        <input
          id="aceite-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => handleChangeTexto('email', e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'aceite-email-error' : undefined}
          disabled={isSubmitting}
          className={inputBase}
        />
        {errors.email && (
          <p id="aceite-email-error" className={erroBase}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Telefone */}
      <div>
        <label
          htmlFor="aceite-telefone"
          className="mb-1 block text-sm font-medium text-text-primary"
        >
          Telefone
        </label>
        <input
          id="aceite-telefone"
          type="tel"
          autoComplete="tel"
          value={form.telefone}
          onChange={(e) => handleChangeTexto('telefone', e.target.value)}
          aria-invalid={errors.telefone ? true : undefined}
          aria-describedby={
            errors.telefone ? 'aceite-telefone-error' : undefined
          }
          disabled={isSubmitting}
          className={inputBase}
        />
        {errors.telefone && (
          <p id="aceite-telefone-error" className={erroBase}>
            {errors.telefone}
          </p>
        )}
      </div>

      {/* Aceite dos termos */}
      <div>
        <label className="flex items-start gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={form.aceitouTermos}
            onChange={(e) => handleChangeTermos(e.target.checked)}
            aria-invalid={errors.aceitouTermos ? true : undefined}
            aria-describedby={
              errors.aceitouTermos ? 'aceite-termos-error' : undefined
            }
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 rounded border-border-primary text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-1"
          />
          <span>
            Declaro ter lido e aceito os termos da proposta comercial da
            Lavita Code.
          </span>
        </label>
        {errors.aceitouTermos && (
          <p id="aceite-termos-error" className={erroBase}>
            {errors.aceitouTermos}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-accent-primary px-4 py-2 font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:opacity-70"
      >
        {isSubmitting ? 'Enviando...' : 'Registrar aceite'}
      </button>
    </form>
  );
}

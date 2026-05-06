/// <reference types="vite/client" />

// Tipagem das variáveis de ambiente expostas pelo Vite ao runtime do
// cliente. Apenas chaves com prefixo `VITE_` são embutidas pelo build;
// qualquer outra variável definida no `.env*` é descartada com segurança.
//
// VITE_FORMSPREE_ENDPOINT — URL POST do Formspree (ou equivalente) que
// recebe o payload do formulário de aceite. Ausência intencional em dev
// é tolerada (o `AceiteForm` colapsa graciosamente para WhatsApp em
// produção; em dev exibe um banner amarelo de aviso). Ver Task 11.4.
interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

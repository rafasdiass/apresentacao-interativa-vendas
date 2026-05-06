// ESLint 9 flat config — Apresentação Interativa de Vendas
//
// Composição:
// - @eslint/js recommended
// - typescript-eslint recommended (non-type-checked; é o suficiente para MVP e
//   evita custo de `parserOptions.project` em todo arquivo TS). Subir para
//   `recommendedTypeChecked` no futuro se quisermos regras semânticas mais
//   estritas (ex.: `no-floating-promises`).
// - eslint-plugin-react-hooks (rules-of-hooks + exhaustive-deps)
// - eslint-plugin-react-refresh (Vite fast-refresh integrity)
// - eslint-config-prettier por último: desliga regras estilísticas que
//   colidem com o Prettier.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage', '.vercel', '.netlify'],
  },
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // TypeScript já cobre unused locals/params via `noUnusedLocals`/
      // `noUnusedParameters` no tsconfig. Mantemos a regra do ESLint, mas
      // permitindo o prefixo `_` como escape para casos legítimos (ex.:
      // parâmetros exigidos por assinatura mas não usados).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  prettierConfig,
);

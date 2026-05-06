/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Mapeia as CSS custom properties declaradas em `src/styles/tokens.css`
        // para utilitários Tailwind. Usar `var()` direto aqui (em vez de
        // `rgb(var(--x) / <alpha-value>)`) mantém consistência com os tokens
        // em formato hex e evita reformatar a paleta inteira para triplas RGB.
        'bg-primary': 'var(--color-background-primary)',
        'bg-secondary': 'var(--color-background-secondary)',
        'bg-tertiary': 'var(--color-background-tertiary)',
        'surface-dark': 'var(--color-surface-dark)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-success': 'var(--color-text-success)',
        'text-info': 'var(--color-text-info)',
        'text-on-dark': 'var(--color-text-on-dark)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-tertiary': 'var(--color-border-tertiary)',
        'status-positive': 'var(--color-status-positive)',
        'status-warning': 'var(--color-status-warning)',
        'status-negative': 'var(--color-status-negative)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: 'var(--font-body)',
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
};

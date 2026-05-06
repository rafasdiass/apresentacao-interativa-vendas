import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento #root não encontrado em index.html');
}

/*
 * Integração `@axe-core/react` apenas em desenvolvimento (Task 14.4 /
 * Requirements 9.2, 9.4, 9.6). Em produção a biblioteca é um custo
 * desnecessário e pode vazar ruído de console; carregamos dinamicamente
 * somente quando `import.meta.env.DEV` é verdadeiro para que o bundle
 * de produção não inclua o pacote.
 */
if (import.meta.env.DEV) {
  void import('@axe-core/react').then(({ default: axe }) => {
    void axe(React, ReactDOM, 1000);
  });
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

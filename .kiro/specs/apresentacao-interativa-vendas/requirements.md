# Documento de Requisitos — Apresentação Interativa de Vendas

## Introdução

Este documento especifica os requisitos para a construção de uma Apresentação Interativa de Vendas destinada ao fechamento do contrato do projeto "App Condomínio Digital" (cliente Ster, desenvolvedor Lavita, 520 unidades, stack Ionic + Angular + NestJS).

A apresentação será uma aplicação web hospedada online que o Vendedor compartilha por link com o Cliente. O Cliente poderá percorrer autonomamente o orçamento comercial, testar um MVP embutido (demonstração) do aplicativo em duas visões — Morador e Síndico — e executar ações de aceite. A construção adotará React + TailwindCSS + JSX, substituindo o HTML monolítico existente (`demo_app_condominio_digital.html`) por componentes desacoplados, e incorporará o conteúdo comercial de `Proposta_Comercial_App_Condominio.docx`.

O objetivo de negócio da apresentação é maximizar a taxa de conversão por meio de técnicas de vendas consultivas: demonstração de valor antes de preço, prova social, benchmarking de mercado, ROI explícito e CTA acessível em qualquer ponto da jornada.

## Glossário

- **Apresentacao**: Aplicação web estática entregável como resultado desta feature. Sinônimo de "painel de vendas" ou "deck interativo".
- **Cliente**: Usuário final da Apresentacao que está avaliando a compra do produto (síndico, comprador, representante do condomínio Ster).
- **Vendedor**: Usuário que compartilha, apresenta ou acompanha a Apresentacao em reunião (Lavita).
- **Demo**: Módulo interativo embutido na Apresentacao que simula o App Condomínio Digital em duas visões (Morador e Síndico). Deriva do HTML existente `demo_app_condominio_digital.html`.
- **Proposta**: Conteúdo comercial extraído de `Proposta_Comercial_App_Condominio.docx` (escopo, cronograma, investimento, condições, aceite).
- **Slot**: Faixa horária selecionável para reserva na Demo (ex.: 08:00, 09:00).
- **Area_Comum**: Espaço gerenciado pela Demo. Valores: Quadra de Vôlei, Piscina, Deck e Salão.
- **CTA**: Call-to-Action — elemento clicável de conversão (ex.: "Aceitar proposta", "Falar no WhatsApp").
- **NFR**: Requisito não-funcional.
- **MVP**: Produto mínimo viável — neste contexto, a Demo embutida.
- **Sistema**: A própria Apresentacao como software em execução no navegador do usuário.

## Análise dos Artefatos Existentes

Esta seção consolida a análise dos dois artefatos-fonte, conforme solicitado. Cada item listado gera requisitos explícitos nas seções seguintes.

### Bugs e Gaps Identificados em `demo_app_condominio_digital.html`

1. **Função `sendPrompt` indefinida**: O HTML chama `onclick="sendPrompt(...)"` em 4 botões, mas a função nunca é declarada no `<script>`. Em produção standalone, os botões silenciosamente lançam `ReferenceError`.
2. **Classe `sr-only` referenciada mas não definida**: O `<h2 class="sr-only">` depende de CSS externo.
3. **Variáveis CSS não resolvidas**: Todos os estilos usam `var(--color-background-primary)`, `var(--color-text-secondary)`, etc., sem declaração de `:root`. Fora do ambiente original (artifact do Claude), a UI aparece sem cores.
4. **Seleção da "Piscina" sem comportamento**: O card da Piscina é visualmente clicável (mesmo padrão dos outros) mas não tem `onclick`, gerando expectativa falha.
5. **Regra de 2h não é aplicada**: O texto diz "Limite 2h" mas `nextHour()` sempre soma 2h sem validar colisão com o próximo Slot ocupado ou fim de expediente.
6. **`nextHour('21:00')` retorna `23:00`**: Permite reserva além do limite (22h dias úteis, 24h finais de semana) descrito na Proposta.
7. **Sem responsividade**: Grid `320px minmax(0, 1fr)` e KPIs em 4 colunas quebram em viewport mobile.
8. **Estado não persiste**: Recarregar a página perde reservas feitas. Aceitável para demo, mas precisa ser documentado.
9. **Falta ARIA nos tabs**: Botões "Visão do Morador"/"Painel do Síndico" não usam `role="tablist"`, `aria-selected`, navegação por teclado.
10. **Mistura de estilos inline com variáveis globais**: Impede reuso e manutenção; motivo central da refatoração para componentes React + Tailwind.
11. **Footer de stack desatualizado vs. Proposta**: A Demo lista "Ionic 8 + Angular 17"; a Proposta cita "Ionic + Angular" sem versão — alinhar ou omitir versão.
12. **Piscina marcada como "Fechada às segundas" no card mas "Fechada hoje · Manutenção" na timeline**: Inconsistência de mensagem.
13. **`state.bookedSlots` é compartilhado entre áreas**: Trocar de Quadra para Deck mostra os mesmos horários ocupados, o que é incorreto.

### Funcionalidades da Demo a Preservar

- Mockup mobile com visão do Morador (header da casa, seleção de área, grid de horários, confirmação).
- Painel do Síndico com KPIs (reservas, ocupação, casas ativas, conflitos).
- Mapa de ocupação em tempo real (barras horizontais por área).
- Ações rápidas do síndico (bloquear área, alterar horários, exportar relatório).
- Lista de últimas reservas.
- Troca entre abas Morador ↔ Síndico.
- Timeline "Suas próximas reservas" do Morador.

### Conteúdo da Proposta a Exibir

- Cabeçalho: cliente Ster, desenvolvedor Lavita, data 05/05/2026, validade 30 dias.
- Sumário executivo: 520 unidades, 10 semanas, 3 áreas, 2 plataformas (iOS + Android), entrega incremental com MVP em uso real a partir da Semana 7.
- Escopo das áreas comuns: Quadra de Vôlei (08–22h úteis, 08–00h finais; limite 2h), Piscina (horários específicos por dia; informativa), Deck e Salão (reserva exclusiva).
- Funcionalidades entregues por módulo (Morador e Síndico).
- Cronograma de 4 fases × 10 semanas com entregáveis por fase.
- Investimento: R$ 15.000 backend + R$ 18.500 mobile = R$ 33.500 total (pagamento único); mensalidade R$ 1.150.
- Condições: entrada 50% (R$ 16.750), saldo 50% (R$ 16.750) na entrega, validade 30 dias, garantia 90 dias, PIX/boleto/transferência.
- Itens inclusos na mensalidade (uptime, atualizações, bugs, backups, segurança, suporte).
- Diferenciais: automação total, lançamento gradual, custo-benefício Fortaleza.
- Bloco de aceite.

## Requisitos

### Requisito 1: Estrutura Geral da Apresentação

**User Story:** Como Cliente, quero percorrer a Apresentacao de forma linear ou por navegação lateral, para que eu possa entender a proposta no meu ritmo antes de decidir.

#### Acceptance Criteria

1. THE Sistema SHALL exibir seções na ordem: Hero → Demo interativa → Escopo → Cronograma → Investimento → Benchmarking → Diferenciais → Aceite.
2. THE Sistema SHALL renderizar uma navegação fixa (top ou lateral) com âncoras para cada seção da Apresentacao.
3. WHEN o Cliente clica em um item da navegação, THE Sistema SHALL rolar suavemente até a seção correspondente em menos de 600ms.
4. THE Sistema SHALL destacar visualmente na navegação a seção atualmente visível no viewport.
5. WHERE o viewport tem largura inferior a 768px, THE Sistema SHALL exibir a navegação em formato colapsável (menu hambúrguer ou bottom bar).

### Requisito 2: Exibição do Orçamento Comercial

**User Story:** Como Cliente, quero visualizar todos os termos comerciais da Proposta dentro da Apresentacao, para que eu não precise abrir o documento `.docx` em paralelo.

#### Acceptance Criteria

1. THE Sistema SHALL exibir o cabeçalho da Proposta com cliente "Ster", desenvolvedor "Lavita", data "05/05/2026" e validade "30 dias".
2. THE Sistema SHALL renderizar a tabela de escopo das três áreas comuns (Quadra, Piscina, Deck e Salão) com horários de dias úteis, finais de semana e regra principal.
3. THE Sistema SHALL renderizar a tabela do cronograma das 4 fases (Semanas 1–2, 3–6, 7–8, 9–10) com atividades e entregáveis.
4. THE Sistema SHALL renderizar a tabela de investimento com os itens "Backend NestJS + Painel Administrativo (R$ 15.000,00)", "Aplicativo Mobile Ionic/Angular — Android e iOS (R$ 18.500,00)" e total "R$ 33.500,00".
5. THE Sistema SHALL renderizar a seção de mensalidade com valor "R$ 1.150,00" e lista de itens inclusos.
6. THE Sistema SHALL renderizar as condições de pagamento: entrada 50% (R$ 16.750,00) e saldo 50% (R$ 16.750,00).
7. THE Sistema SHALL renderizar a garantia de 90 dias, formas de pagamento (PIX, transferência, boleto) e prazo de entrega (10 semanas).
8. WHEN qualquer valor monetário é exibido, THE Sistema SHALL formatá-lo como `R$ X.XXX,XX` (locale pt-BR).
9. THE Sistema SHALL carregar os dados comerciais de um módulo de configuração tipado (`proposta.ts`), não hardcoded no JSX de apresentação.
10. FOR ALL valores da tabela de investimento, a soma dos itens SHALL ser igual ao total declarado (invariante de totalização).

### Requisito 3: Demonstração Interativa Embutida (Demo)

**User Story:** Como Cliente, quero testar o aplicativo dentro da própria Apresentacao, para que eu possa sentir a experiência do Morador e do Síndico antes de comprar.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar uma seção "Teste o aplicativo agora" com duas abas: "Visão do Morador" e "Painel do Síndico".
2. WHEN o Cliente clica em uma aba, THE Sistema SHALL alternar entre as visões sem recarregar a página e atualizar os atributos `aria-selected` dos tabs.
3. THE Sistema SHALL renderizar, na visão do Morador, um mockup mobile com seleção de Area_Comum, grade de Slots horários e botão de confirmação.
4. WHEN o Cliente seleciona uma Area_Comum, THE Sistema SHALL carregar a grade de Slots específica daquela área.
5. WHEN o Cliente seleciona um Slot livre, THE Sistema SHALL habilitar o botão de confirmação exibindo "Reservar HH:MM – HH:MM".
6. WHEN o Cliente confirma uma reserva, THE Sistema SHALL exibir mensagem de sucesso, marcar o Slot como ocupado e resetar a seleção.
7. IF um Slot está ocupado, THEN THE Sistema SHALL desabilitar o botão correspondente e aplicar estilo de indisponibilidade (cor cinza, cursor `not-allowed`).
8. IF o Slot + 2 horas ultrapassa o horário de fechamento da Area_Comum, THEN THE Sistema SHALL desabilitar aquele Slot (corrige bug do HTML atual onde 21:00 gerava reserva até 23:00 na Quadra).
9. THE Sistema SHALL manter grades de disponibilidade independentes por Area_Comum (corrige bug de estado compartilhado).
10. WHERE a Area_Comum selecionada é "Piscina", THE Sistema SHALL exibir mensagem informativa sobre horários e manutenção, sem permitir reserva (consistente com a Proposta, que descreve Piscina como informativa).
11. THE Sistema SHALL renderizar, na visão do Síndico, KPIs (reservas hoje, ocupação atual, casas ativas, conflitos), mapa de ocupação em tempo real das três áreas, lista de ações rápidas e lista de últimas reservas.
12. WHEN o Cliente clica em uma ação rápida do Síndico, THE Sistema SHALL abrir um modal ou tooltip explicando a funcionalidade, substituindo a chamada indefinida `sendPrompt(...)` do HTML original.
13. THE Sistema SHALL persistir o estado da Demo apenas em memória durante a sessão; recarregar a página SHALL resetar a Demo ao estado inicial.

### Requisito 4: Técnicas de Vendas e Persuasão

**User Story:** Como Vendedor, quero que a Apresentacao aplique gatilhos de vendas consultivas, para que a conversão do Cliente seja maximizada sem pressão explícita.

#### Acceptance Criteria

1. THE Sistema SHALL exibir, no hero inicial, proposta de valor de uma linha ("Tire 520 unidades do WhatsApp em 10 semanas" ou equivalente alinhado ao escopo) e CTA primário.
2. THE Sistema SHALL apresentar a Demo (Requisito 3) antes de qualquer discussão de preço na navegação linear.
3. THE Sistema SHALL exibir uma seção de ROI com estimativas quantificadas de ganho para o condomínio (ex.: horas/mês economizadas pela portaria, conflitos evitados, transparência).
4. THE Sistema SHALL exibir uma seção de prova social (social proof) com no mínimo 2 elementos entre: depoimento do desenvolvedor, credenciais técnicas, projetos anteriores ou menções a tecnologias consolidadas (NestJS, Ionic).
5. THE Sistema SHALL manter um CTA secundário visível ("Falar no WhatsApp" ou "Aceitar proposta") em qualquer ponto da rolagem, seja via botão flutuante, seja via barra inferior persistente.
6. WHEN o Cliente rola 70% da Apresentacao sem tocar em nenhum CTA, THE Sistema SHALL apresentar um lembrete discreto de próxima ação (banner ou toast não-bloqueante).
7. THE Sistema SHALL destacar o diferencial de "MVP em uso real a partir da Semana 7" como redução de risco percebido, com badge ou callout visual.
8. THE Sistema SHALL exibir cronômetro ou indicador da "Validade: 30 dias" perto da seção de investimento, gerando urgência alinhada à Proposta.

### Requisito 5: Benchmarking e Prova de Valor

**User Story:** Como Cliente, quero entender como esta Proposta se compara ao mercado, para que eu possa justificar internamente a contratação.

#### Acceptance Criteria

1. THE Sistema SHALL exibir uma seção "Benchmark de mercado" com comparativo entre esta Proposta e faixas típicas do mercado brasileiro para aplicativos de condomínio (apps white-label SaaS, desenvolvimento customizado Sudeste, concorrentes regionais).
2. THE Sistema SHALL apresentar o comparativo em formato tabela ou cards, contemplando no mínimo: custo inicial, custo mensal, prazo de entrega, propriedade do código e customização.
3. THE Sistema SHALL citar fontes ou bases das faixas de mercado no rodapé do comparativo (ex.: "Valores de referência: faixa observada em apps SaaS white-label 2024–2026").
4. THE Sistema SHALL destacar a posição competitiva da Proposta (custo-benefício Fortaleza × Sudeste, conforme item 07 da Proposta).
5. THE Sistema SHALL exibir uma seção "Por que sob medida" que justifique a escolha de desenvolvimento dedicado sobre SaaS genérico.

### Requisito 6: Call-to-Action e Aceite

**User Story:** Como Cliente, quero ter um caminho claro para aceitar a Proposta ou iniciar uma conversa, para que eu possa avançar imediatamente se estiver convencido.

#### Acceptance Criteria

1. THE Sistema SHALL exibir, na seção final, um bloco de aceite com os três CTAs: "Aceitar proposta", "Falar no WhatsApp", "Baixar PDF da proposta".
2. WHEN o Cliente clica em "Aceitar proposta", THE Sistema SHALL abrir um formulário com campos obrigatórios (nome, documento, e-mail, telefone) e um checkbox de declaração de aceite com o texto da Proposta.
3. WHEN o Cliente submete o formulário de aceite com todos os campos válidos, THE Sistema SHALL enviar os dados para um endpoint configurável (webhook, e-mail, Formspree ou equivalente) e exibir confirmação visual.
4. IF o formulário de aceite é submetido com campos inválidos, THEN THE Sistema SHALL destacar cada campo inválido e exibir mensagem de erro específica por campo.
5. WHEN o Cliente clica em "Falar no WhatsApp", THE Sistema SHALL abrir `wa.me/<numero_lavita>` em nova aba com mensagem pré-preenchida referenciando a Proposta.
6. WHEN o Cliente clica em "Baixar PDF da proposta", THE Sistema SHALL iniciar o download do arquivo PDF/DOCX da Proposta hospedado junto à aplicação.
7. THE Sistema SHALL exibir no rodapé o nome do desenvolvedor (Lavita), contato e link para política de privacidade.

### Requisito 7: Modo Apresentador (Vendedor)

**User Story:** Como Vendedor, quero controlar a Apresentacao durante uma reunião ao vivo, para que eu possa guiar o Cliente pelos pontos mais relevantes.

#### Acceptance Criteria

1. WHERE a URL contém o parâmetro `?modo=apresentador`, THE Sistema SHALL ativar o Modo Apresentador com controles adicionais.
2. WHILE o Modo Apresentador está ativo, THE Sistema SHALL exibir controles de navegação por teclado (setas esquerda/direita entre seções, `Esc` para voltar ao topo).
3. WHILE o Modo Apresentador está ativo, THE Sistema SHALL exibir notas do apresentador abaixo de cada seção (ex.: "Pontos a enfatizar: automação total, MVP Semana 7").
4. THE Sistema SHALL permitir que o Vendedor copie o link da Apresentacao com um clique em um botão "Copiar link de compartilhamento" visível apenas no Modo Apresentador.
5. WHERE o parâmetro `modo` está ausente ou diferente de `apresentador`, THE Sistema SHALL renderizar a Apresentacao em modo Cliente (sem controles adicionais e sem notas).

### Requisito 8: Hospedagem e Acesso Online (NFR)

**User Story:** Como Vendedor, quero compartilhar a Apresentacao por link público, para que o Cliente possa acessá-la de qualquer dispositivo sem instalar nada.

#### Acceptance Criteria

1. THE Sistema SHALL ser construído como aplicação estática compatível com deploy em plataformas de hospedagem gratuita (Vercel, Netlify ou GitHub Pages) — escolha final a ser definida na fase de Design.
2. THE Sistema SHALL carregar a primeira tela útil (Largest Contentful Paint) em menos de 2,5 segundos em conexão 4G em um Moto G simulado.
3. THE Sistema SHALL ser acessível por URL HTTPS pública sem autenticação.
4. THE Sistema SHALL funcionar offline após primeiro carregamento em qualquer seção já visitada (via service worker ou estratégia equivalente) — desejável, não bloqueante.
5. THE Sistema SHALL incluir metadados Open Graph (título, descrição, imagem de preview) para que o compartilhamento em WhatsApp e e-mail renderize card rico.

### Requisito 9: Responsividade e Acessibilidade (NFR)

**User Story:** Como Cliente, quero acessar a Apresentacao no celular, tablet ou desktop, para que eu possa revisá-la em qualquer contexto.

#### Acceptance Criteria

1. THE Sistema SHALL renderizar corretamente em viewports de 320px, 768px, 1024px e 1440px de largura.
2. THE Sistema SHALL garantir contraste mínimo WCAG AA (4,5:1 para texto normal) em toda a interface.
3. THE Sistema SHALL permitir navegação completa por teclado, incluindo tabs de alternância Morador/Síndico e formulário de aceite.
4. THE Sistema SHALL expor landmarks ARIA (`<main>`, `<nav>`, `<section>`) e anúncios de região para leitores de tela.
5. WHEN um elemento recebe foco via teclado, THE Sistema SHALL aplicar outline visível conforme padrão Tailwind `focus-visible`.
6. THE Sistema SHALL fornecer textos alternativos descritivos para todas as imagens e ícones informativos.

### Requisito 10: Arquitetura Técnica em React + Tailwind

**User Story:** Como Vendedor que também é desenvolvedor (Lavita), quero a base construída em componentes React com Tailwind, para que eu possa manter e evoluir a Apresentacao com velocidade.

#### Acceptance Criteria

1. THE Sistema SHALL ser implementado em React 18+ com TypeScript e TailwindCSS 3+.
2. THE Sistema SHALL organizar componentes por seção funcional (ex.: `Hero`, `DemoMorador`, `DemoSindico`, `TabelaInvestimento`, `Benchmark`, `Aceite`).
3. THE Sistema SHALL extrair dados comerciais (valores, datas, cronograma, escopo) para um módulo tipado (`src/data/proposta.ts`) separado dos componentes de apresentação.
4. THE Sistema SHALL substituir todos os estilos inline do HTML original por classes utilitárias Tailwind ou tokens de tema definidos em `tailwind.config.js`.
5. THE Sistema SHALL definir as variáveis de cor originais (`--color-background-primary`, `--color-text-secondary`, etc.) como tokens Tailwind ou como CSS custom properties declaradas em um único local (`src/styles/tokens.css`).
6. THE Sistema SHALL substituir a função indefinida `sendPrompt(...)` do HTML original por handlers explícitos que abrem modais ou tooltips descritivos (consistente com Requisito 3, item 12).
7. THE Sistema SHALL definir a classe utilitária `sr-only` via Tailwind (builtin) para conteúdos destinados apenas a leitores de tela.
8. THE Sistema SHALL definir a máquina de estado da Demo em um hook dedicado (`useDemoReservas`) com tipos explícitos para Area_Comum e Slot.

### Requisito 11: Preservação e Correção das Funcionalidades da Demo Atual

**User Story:** Como Cliente, quero a nova Demo com a mesma fluidez da atual mas sem os defeitos identificados, para que eu tenha confiança na qualidade do produto final.

#### Acceptance Criteria

1. THE Sistema SHALL preservar o mockup mobile estilizado com header azul-marinho, conteúdo branco e status bar.
2. THE Sistema SHALL preservar os KPIs do painel do Síndico (reservas hoje, ocupação, casas ativas, conflitos resolvidos).
3. THE Sistema SHALL preservar o mapa de ocupação em tempo real com barras horizontais por Area_Comum e legenda de cores.
4. THE Sistema SHALL preservar a timeline "Suas próximas reservas" na visão do Morador.
5. THE Sistema SHALL corrigir os bugs listados na seção "Análise dos Artefatos Existentes" (inconsistência de Piscina, estado compartilhado entre áreas, cálculo de `nextHour` além de 22h, função `sendPrompt` indefinida, classe `sr-only` não declarada, variáveis CSS não resolvidas, ausência de ARIA nos tabs).

### Requisito 12: Correctness Properties (Propriedades Testáveis)

**User Story:** Como desenvolvedor (Lavita), quero propriedades formais sobre o comportamento da Apresentacao, para que regressões sejam detectadas automaticamente.

#### Acceptance Criteria

1. FOR ALL seções da navegação, THE Sistema SHALL garantir que clicar em um item da nav leva ao elemento cujo `id` corresponde ao hash — e o elemento existe no DOM (propriedade de roteamento consistente).
2. FOR ALL Slots da Demo, SE o Slot está marcado como ocupado, ENTÃO nenhuma sequência de cliques SHALL resultar em reserva confirmada para aquele Slot (invariante de não-duplicidade).
3. FOR ALL Area_Comum na Demo, a soma de Slots "ocupados" mais "livres" mais "fora do expediente" SHALL ser igual ao total de Slots exibidos (invariante de particionamento).
4. FOR ALL valores da tabela de investimento, `soma(itens) === total` (invariante de totalização — referenciado em Requisito 2.10).
5. FOR ALL viewports entre 320px e 1920px de largura, o CTA primário SHALL estar acessível (visível ou alcançável em no máximo um toque) em qualquer posição de rolagem (invariante de acessibilidade do CTA).
6. FOR ALL pares `(area, slot)` onde `slot + 2h > fechamento(area)`, o botão de reserva daquele Slot SHALL estar desabilitado (propriedade de validação de horário).
7. FOR ALL cliques repetidos no botão "Confirmar reserva" com o mesmo Slot selecionado, a quantidade de reservas registradas SHALL ser exatamente 1 (propriedade de idempotência da confirmação).
8. FOR ALL dados comerciais (`proposta.ts`), `formatarMoeda(parseMoeda(v)) === v` para qualquer valor `v` já formatado (propriedade round-trip da formatação monetária).
9. FOR ALL alternâncias de aba Morador ↔ Síndico, o estado da Demo Morador (Area_Comum selecionada, Slot selecionado, reservas feitas) SHALL ser preservado entre alternâncias (propriedade de preservação de estado).

## Premissas e Riscos

1. **Conteúdo da Proposta**: O conteúdo de `Proposta_Comercial_App_Condominio.docx` foi extraído automaticamente via `unzip` do XML do documento. Pequenas diferenças de formatação entre a extração e o original renderizado em Word podem existir e serão validadas com o Vendedor na fase de Design.
2. **Valores e datas**: Valores monetários e datas citados nos requisitos foram retirados da Proposta com data 05/05/2026. Se a data de apresentação ao Cliente mudar, a seção de validade e os CTAs de urgência devem ser revistos.
3. **Número de WhatsApp e endpoint de aceite**: O número do WhatsApp do Vendedor e o endpoint de recebimento de aceites não constam na Proposta. Serão solicitados na fase de Design ou tratados como variáveis de ambiente no deploy.
4. **Hospedagem**: A escolha final entre Vercel, Netlify ou GitHub Pages será definida no Design. Todas as três atendem os NFRs listados; a decisão considerará integração com o fluxo de aceite (endpoint serverless vs. serviço externo).
5. **Benchmark de mercado**: Os valores comparativos do Requisito 5 precisam de fontes citáveis. Caso não existam fontes confiáveis gratuitas, serão usadas faixas declaradas como estimativas próprias com base em experiência do Vendedor.
6. **Cases/prova social**: Caso o Vendedor (Lavita) não tenha projetos anteriores publicáveis, a prova social se apoiará em credenciais técnicas, menções a stacks consolidadas e depoimento do desenvolvedor — sem inventar clientes.
7. **Baixar PDF da proposta**: Requer conversão do `.docx` original para `.pdf`. Caso não seja possível automatizar na pipeline de build, o PDF será gerado manualmente e versionado junto ao código.

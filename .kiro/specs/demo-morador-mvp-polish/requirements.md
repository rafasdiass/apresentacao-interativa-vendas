# Documento de Requisitos — Polimento da Demo do Morador (visual de MVP)

## Introdução

Esta feature reformula a aba **Morador** da seção `Demo` da Apresentação Interativa de Vendas para que a experiência tenha cara de MVP real — um aplicativo mobile em produção, em sua versão final — em vez do visual atual, descrito pelo próprio usuário como "muito básico" e com efeito de "mudar de tamanho conforme o conteúdo". O escopo é restrito à visão do Morador (`src/features/demo/DemoMorador.tsx` e seus componentes filhos em `src/features/demo/components/`): `MobileMockup`, `AreaCard`, `SlotGrid`, `ConfirmButton`, `ConfirmMessage` e `TimelineProximas`, além de novos componentes decorativos (barra de tabs inferior, banner de destaque, elementos do header). A aba Síndico, a `DemoSection`, `DemoTabs`, o `demoReducer` e o hook `useDemoReservas` permanecem intocados no nível de comportamento — mudanças aqui são de UI e de reserva de espaço.

Dois problemas motivam a feature:

1. **O Mockup_Mobile muda de tamanho durante o uso**: trocar de `Area_Comum`, selecionar slots, ver/esconder a `ConfirmMessage` e a ausência de `Slot`s na Piscina causam reflow visível. O prospect vê o "celular" encolher e crescer durante a demonstração, o que quebra a ilusão de app real.
2. **O mockup está muito básico**: três `AreaCard`s cinza textuais, um grid de slots minimalista e um botão não bastam para transmitir a sensação de um aplicativo mobile acabado. Faltam elementos estruturais típicos de home screens de apps em produção — barra de tabs inferior, banner de destaque, ícones de identidade visual, hierarquia tipográfica.

A feature é crítica porque a `Demo_Morador` é o primeiro ponto de interação real na Apresentação — é onde o prospect forma a impressão de "esse app parece pronto". O polimento precisa acontecer sem regressão funcional: todo o fluxo validado pelas Properties 3–8 do spec `apresentacao-interativa-vendas` (idempotência de `CONFIRM`, respeito a fechamento, isolamento de áreas, Piscina não reservável, preservação de estado em `SWITCH_VIEW`) continua valendo.

## Glossário

- **Demo_Morador**: Aba "Visão do Morador" dentro da `DemoSection`, implementada em `src/features/demo/DemoMorador.tsx`. Alvo único desta feature.
- **Mockup_Mobile**: Componente `MobileMockup` que renderiza a moldura visual do celular (borda, status bar, header, área de conteúdo, barra de tabs inferior). Responsável pela estabilidade dimensional.
- **Coluna_Narrativa**: Coluna direita da `Demo_Morador` (em viewport ≥ 768px) com título de vendas, mini-cards de destaque, `TimelineProximas` e CTA "Ver fluxo completo".
- **Area_Comum**: Espaço gerenciado pela Demo. Valores: Quadra de Vôlei, Deck e Salão, Piscina.
- **Slot**: Faixa horária selecionável no formato `HH:MM`.
- **Status_Bar**: Barra superior do `Mockup_Mobile` que imita a status bar do iOS/Android (relógio, ícones de rede/bateria).
- **Tab_Bar_Inferior**: Barra decorativa fixa na base do `Mockup_Mobile` com 4 ícones e rótulos representando seções do app (Home, Reservas, Notificações, Perfil). Decorativa — não navega.
- **Banner_Destaque**: Elemento visual entre o header e os `AreaCard`s que comunica uma informação contextual (aviso, destaque, próxima reserva), característico de home screens de apps reais.
- **Reflow**: Mudança de dimensões ou posição de elementos da página causada por troca de conteúdo. Nesta feature, é o comportamento a ser eliminado.
- **Dimensoes_Fixas**: Propriedade visual segundo a qual um container mantém largura e altura exatas em pixels durante toda a vida do componente, independente do conteúdo interno.
- **Altura_Reservada**: Altura CSS mínima aplicada a um container para garantir que ele ocupe o mesmo espaço vertical independentemente do conteúdo renderizado.
- **Apresentador**: Usuário Vendedor operando a Apresentação ao vivo durante uma reunião comercial (fonte do uso interativo do mouse e do teclado).
- **Observador**: Prospect/cliente potencial assistindo à Apresentação, normalmente via tela compartilhada ou link enviado.
- **Sistema**: A `Demo_Morador` como software em execução no navegador.

## Pontos de Dor Identificados

Esta seção consolida os problemas reportados pelo usuário, cada um gerando requisitos explícitos adiante.

### Instabilidade dimensional

1. **`Mockup_Mobile` sem altura fixa**: trocar entre Quadra (14 slots), Deck (7 slots) e Piscina (0 slots) faz o mockup encolher ou crescer.
2. **`ConfirmMessage` ocupa espaço apenas quando presente**: o primeiro `CONFIRM` empurra todo o layout para baixo.
3. **`ConfirmButton` troca rótulo entre "Selecione um horário" e "Reservar HH:MM – HH:MM"**: a diferença de largura pode causar micro-reflow.
4. **Mensagem "Esta área é informativa…"** do `SlotGrid` vazio tem altura muito menor que o grid 3×5 da Quadra.
5. **`Coluna_Narrativa`** alinha ao topo com `items-start` mas seu conteúdo interage com a altura do mockup, gerando desalinhamento visual entre colunas durante transições.

### Mockup não parece um app em versão final

6. **Falta barra de tabs inferior**: apps mobile de produção quase sempre expõem 3–5 tabs na base; o mockup atual termina no `ConfirmButton`, revelando imediatamente que é um stub.
7. **Header pobre**: "CASA 247 · BLOCO B" + "Olá, morador 👋" sem avatar, sino de notificações ou elementos visuais de produto.
8. **Nada entre o header e os `AreaCard`s**: home screens reais costumam ter banners, atalhos ou destaques contextuais; a ausência deixa o topo do mockup vazio.
9. **`Status_Bar` minimalista**: "9:41" + "● ● ●" não lembra a barra de status de um app real — falta ícones distintos de sinal, Wi-Fi e bateria.
10. **`AreaCard` sem ícone ou imagem**: três cards cinza textuais; não comunicam visualmente "quadra", "deck", "piscina".
11. **`ConfirmMessage` sem ícone de sucesso** nem animação de entrada.
12. **Slots sem hierarquia forte de estado**: `livre`, `ocupado`, `fora-do-expediente` usam variações sutis de cinza; só o selecionado se destaca.
13. **Micro-interações escassas**: transições de hover/press nos slots e cards limitam-se a `transition-colors`, sem feedback de escala, sombra ou press.

## Requisitos

### Requisito 1: Dimensoes_Fixas do Mockup_Mobile

**User Story:** Como Apresentador conduzindo uma demo ao vivo, quero que o `Mockup_Mobile` mantenha largura e altura fixas durante toda a sessão, para que o prospect nunca veja o "celular" encolher ou crescer entre interações e a ilusão de app real se mantenha intacta.

#### Acceptance Criteria

1. THE Mockup_Mobile SHALL usar altura total fixa em pixels, declarada explicitamente, em vez de depender do conteúdo interno.
2. THE Mockup_Mobile SHALL usar largura total fixa em pixels, declarada explicitamente, em vez de depender do conteúdo interno.
3. WHEN a `Area_Comum` selecionada muda entre Quadra, Deck e Piscina, THE Mockup_Mobile SHALL preservar altura e largura sem reflow visível.
4. WHEN a `ConfirmMessage` aparece pela primeira vez após um `CONFIRM` bem-sucedido, THE Mockup_Mobile SHALL exibi-la dentro da `Altura_Reservada` existente, sem empurrar o `ConfirmButton` para cima nem crescer verticalmente.
5. WHILE a `ConfirmMessage` não está presente, THE Mockup_Mobile SHALL manter o espaço da mensagem reservado e invisível ao `Observador`, evitando reflow no primeiro `CONFIRM`.
6. WHEN o `ConfirmButton` troca entre os rótulos "Selecione um horário" e "Reservar HH:MM – HH:MM", THE ConfirmButton SHALL manter largura e altura constantes.
7. WHEN a `Area_Comum` selecionada é Piscina e o `SlotGrid` não renderiza grid de slots, THE SlotGrid SHALL ocupar a mesma altura que o grid de `Slot`s da Quadra no mesmo viewport, preenchida com um bloco informativo.
8. IF em qualquer estado a soma das alturas dos elementos internos for menor que a `Altura_Reservada` do `Mockup_Mobile`, THEN o `Mockup_Mobile` SHALL distribuir ou preencher o espaço restante sem alterar a altura total.
9. THE Mockup_Mobile SHALL rejeitar, em tempo de desenvolvimento, qualquer declaração CSS no eixo vertical que dependa de conteúdo (`height: auto`, `height: min-content`, `height: fit-content`) no container raiz ou em containers intermediários que participem da altura total.

### Requisito 2: Estabilidade da Coluna_Narrativa e do layout de duas colunas

**User Story:** Como Observador assistindo à apresentação por tela compartilhada, quero que as duas colunas da `Demo_Morador` fiquem estáveis durante as interações do apresentador, para que minha atenção permaneça no fluxo de reserva e não seja desviada por elementos se reorganizando.

#### Acceptance Criteria

1. WHILE o viewport tem largura maior ou igual a 768 pixels, THE Demo_Morador SHALL renderizar as duas colunas (Mockup_Mobile à esquerda, Coluna_Narrativa à direita) com alturas visualmente alinhadas no topo.
2. WHEN o `Apresentador` interage com o `Mockup_Mobile` (seleção de área, seleção de slot, confirmação, reset), THE Coluna_Narrativa SHALL manter posição vertical constante no viewport.
3. THE Coluna_Narrativa SHALL reservar espaço vertical estável para a `TimelineProximas` e para o botão "Ver fluxo completo", sem depender do estado da Demo.
4. WHERE o viewport tem largura inferior a 768 pixels, THE Demo_Morador SHALL empilhar `Mockup_Mobile` acima da `Coluna_Narrativa` mantendo as mesmas garantias dimensionais descritas no Requisito 1 para o `Mockup_Mobile`.

### Requisito 3: Status_Bar realista

**User Story:** Como Apresentador, quero que a `Status_Bar` do `Mockup_Mobile` se pareça com a barra de status real de um app iOS ou Android, para que o prospect tenha a impressão imediata de estar vendo um aplicativo de produção.

#### Acceptance Criteria

1. THE Status_Bar SHALL exibir um horário fixo no formato `HH:MM` em 24h.
2. THE Status_Bar SHALL exibir, à direita do horário, três indicadores gráficos distintos representando sinal celular, Wi-Fi e bateria.
3. THE Status_Bar SHALL usar peso tipográfico semi-negrito para o horário, espelhando o estilo visual de sistemas operacionais móveis modernos.
4. THE Status_Bar SHALL permanecer visualmente fixa no topo do `Mockup_Mobile` em todos os estados da `Demo_Morador`.
5. THE Status_Bar SHALL marcar todos os seus elementos visuais como `aria-hidden="true"`, já que são decorativos.
6. THE Status_Bar SHALL manter contraste suficiente entre o texto e o fundo escuro para atender ao critério WCAG AA de 4.5:1 para texto normal.

### Requisito 4: Header do app com identidade de produto

**User Story:** Como Apresentador, quero que o header do `Mockup_Mobile` comunique identidade de produto (avatar, saudação personalizada, ícone de notificações), para que o prospect perceba que estamos vendo uma home de app mobile real e não um wireframe.

#### Acceptance Criteria

1. THE Mockup_Mobile SHALL exibir um header com o rótulo da unidade do morador fictício (ex.: "CASA 247 · BLOCO B") acima de uma saudação personalizada.
2. THE Mockup_Mobile SHALL exibir um elemento visual representando um avatar do morador no header.
3. THE Mockup_Mobile SHALL exibir um ícone de sino de notificações no header com um badge numérico decorativo.
4. THE Mockup_Mobile SHALL marcar o avatar e o ícone de notificações como decorativos (`aria-hidden="true"`), já que a Demo não implementa perfil nem central de notificações.
5. THE Mockup_Mobile SHALL preservar a hierarquia tipográfica entre o rótulo da unidade (pequeno, maiúsculas, espaçamento largo) e a saudação (maior, peso médio).
6. THE Header SHALL manter altura fixa em todos os estados da `Demo_Morador`.

### Requisito 5: Banner_Destaque entre o header e os AreaCards

**User Story:** Como Apresentador, quero que exista um banner ou card de destaque logo abaixo do header, para que o mockup comunique visualmente que é um app completo com conteúdo contextual, e não apenas uma tela de seleção isolada.

#### Acceptance Criteria

1. THE Mockup_Mobile SHALL renderizar um `Banner_Destaque` entre o header e o grupo de `AreaCard`s.
2. THE Banner_Destaque SHALL apresentar um texto contextual curto alinhado ao discurso da Demo (ex.: destaque da próxima reserva do morador, aviso do condomínio, novidade do app).
3. THE Banner_Destaque SHALL exibir um ícone visual associado ao seu tema.
4. THE Banner_Destaque SHALL ter altura fixa em todos os estados da `Demo_Morador`.
5. THE Banner_Destaque SHALL atingir contraste WCAG AA entre texto e fundo.
6. THE Banner_Destaque SHALL marcar seu ícone como `aria-hidden="true"` quando redundante com o texto visível.

### Requisito 6: AreaCards com identidade visual

**User Story:** Como Observador, quero que cada `AreaCard` tenha uma identidade visual própria (ícone, cor), para que eu reconheça rapidamente as áreas comuns e perceba o app como polido.

#### Acceptance Criteria

1. THE AreaCard SHALL exibir um ícone ou representação gráfica associada ao tipo da `Area_Comum` (Quadra, Deck, Piscina).
2. THE AreaCard SHALL marcar o ícone como decorativo com `aria-hidden="true"`, já que o nome textual da área continua sendo a label acessível.
3. THE AreaCard SHALL manter a mesma altura em pixels para os três cards em todos os estados.
4. WHEN um `AreaCard` está selecionado, THE AreaCard SHALL exibir feedback visual por borda colorida ou fundo destacado e manter a largura e a altura constantes.
5. WHEN o `Apresentador` passa o cursor sobre um `AreaCard` com `reservavel === true`, THE AreaCard SHALL responder com uma mudança visual sutil (fundo, borda ou sombra) dentro de 150 milissegundos.
6. THE AreaCard SHALL expor `role="radio"` e `aria-checked` refletindo a seleção atual, preservando o comportamento do radiogroup já validado no spec `apresentacao-interativa-vendas`.
7. WHERE a `Area_Comum` tem `reservavel === false`, THE AreaCard SHALL exibir um indicador visual de "apenas informativa" distinto dos cards reserváveis.

### Requisito 7: SlotGrid com hierarquia de estado clara

**User Story:** Como Observador, quero distinguir visualmente e de imediato os slots livres, ocupados, fora do expediente e o slot selecionado, para que eu entenda sem explicação o fluxo de escolha de horário.

#### Acceptance Criteria

1. THE SlotGrid SHALL renderizar cada `Slot` com estilo visual distinto por status: `livre`, `ocupado`, `fora-do-expediente` e `selecionado`.
2. THE SlotGrid SHALL manter o mesmo número de colunas (3) para qualquer `Area_Comum` reservável.
3. THE SlotGrid SHALL manter a mesma altura total para a grade da Quadra e para a grade do Deck em um mesmo viewport, reservando espaço para o maior dos dois.
4. WHEN o `Apresentador` seleciona um `Slot` livre, THE SlotGrid SHALL destacar o slot selecionado com estilo visualmente dominante em relação aos livres não selecionados.
5. WHEN o `Apresentador` passa o cursor sobre um `Slot` livre não selecionado, THE SlotGrid SHALL responder com uma mudança visual sutil dentro de 150 milissegundos.
6. THE SlotGrid SHALL preservar os atributos acessíveis já existentes: `aria-label` descritivo em slots desabilitados, `aria-pressed` em slots livres, `title="Fora do horário"` em slots fora do expediente.
7. THE SlotGrid SHALL atingir contraste WCAG AA entre o texto e o fundo em todos os quatro status.
8. WHERE a `Area_Comum` selecionada é Piscina, THE SlotGrid SHALL exibir um bloco informativo com título, ícone decorativo e explicação textual, ocupando a mesma altura reservada para grades de áreas reserváveis.

### Requisito 8: ConfirmButton estável e com feedback de ação

**User Story:** Como Apresentador, quero que o `ConfirmButton` mude de estado visual (habilitado/desabilitado) e de rótulo sem causar reflow, e que comunique fortemente que uma reserva vai ser confirmada, para que o gesto final do fluxo seja o ápice visual da Demo.

#### Acceptance Criteria

1. THE ConfirmButton SHALL manter largura constante igual à largura da área de conteúdo do `Mockup_Mobile`.
2. THE ConfirmButton SHALL manter altura constante entre os estados habilitado e desabilitado.
3. WHEN o `ConfirmButton` está habilitado, THE ConfirmButton SHALL exibir peso tipográfico negrito e cor de fundo em accent primário.
4. WHEN o `ConfirmButton` está desabilitado, THE ConfirmButton SHALL exibir estilo visualmente distinto de habilitado, com contraste WCAG AA suficiente no texto.
5. WHEN o `Apresentador` pressiona o `ConfirmButton` habilitado, THE ConfirmButton SHALL apresentar um feedback visual de press (escala leve, mudança de brilho ou sombra) com duração de até 200 milissegundos.
6. THE ConfirmButton SHALL preservar o foco visível (`focus-visible:ring`) já existente para navegação por teclado.

### Requisito 9: ConfirmMessage com feedback animado dentro da altura reservada

**User Story:** Como Observador, quero ver uma confirmação de reserva clara e animada, para que eu sinta a satisfação de "dar certo" que espero de um app polido.

#### Acceptance Criteria

1. THE Mockup_Mobile SHALL reservar altura fixa para a `ConfirmMessage` desde o primeiro render, mesmo antes do primeiro `CONFIRM`.
2. WHEN um `CONFIRM` é despachado com sucesso, THE ConfirmMessage SHALL aparecer com animação de entrada (fade e ou slide) com duração entre 150 e 400 milissegundos.
3. THE ConfirmMessage SHALL exibir um ícone visual de sucesso (check ou equivalente) à esquerda do texto.
4. THE ConfirmMessage SHALL preservar `role="status"` e `aria-live="polite"` para anúncio acessível.
5. THE ConfirmMessage SHALL manter o texto "Reserva confirmada: <Area_Comum> das <slot> às <fim>." usando os dados de `state.ultimaConfirmacao`.
6. WHERE o `Observador` prefere movimento reduzido via `prefers-reduced-motion: reduce`, THE ConfirmMessage SHALL exibir a entrada sem animação perceptível.

### Requisito 10: Tab_Bar_Inferior decorativa

**User Story:** Como Observador, quero ver uma barra de tabs na base do `Mockup_Mobile` igual à de um app mobile de produção, para que a tela inteira se comunique como uma home screen completa e não como um fragmento isolado.

#### Acceptance Criteria

1. THE Mockup_Mobile SHALL renderizar uma `Tab_Bar_Inferior` fixa na base do mockup, abaixo da `ConfirmMessage`.
2. THE Tab_Bar_Inferior SHALL exibir exatamente quatro itens na ordem: Home (reservas), Atividades, Notificações, Perfil.
3. THE Tab_Bar_Inferior SHALL exibir cada item como um par ícone mais rótulo textual curto.
4. THE Tab_Bar_Inferior SHALL destacar visualmente o primeiro item como ativo (Home), com cor de accent primário no ícone e no rótulo.
5. THE Tab_Bar_Inferior SHALL manter os demais três itens em estado inativo, com cor neutra.
6. THE Tab_Bar_Inferior SHALL ter altura fixa em pixels, contabilizada dentro da `Altura_Reservada` do `Mockup_Mobile`.
7. THE Tab_Bar_Inferior SHALL marcar todos os seus elementos como decorativos (`aria-hidden="true"`), já que não navega para lugar algum na Demo.
8. IF o `Apresentador` clica em um item da `Tab_Bar_Inferior`, THEN o Sistema SHALL não produzir nenhuma mudança de estado nem efeito colateral observável.
9. THE Tab_Bar_Inferior SHALL atingir contraste WCAG AA entre ícone/rótulo e fundo em ambos os estados (ativo e inativo).

### Requisito 11: Preservação do fluxo funcional e do estado

**User Story:** Como mantenedor do código, quero garantir que a reformulação visual não altere a lógica do `demoReducer`, do hook `useDemoReservas` nem o comportamento acessível atual, para que as Properties 3–8 do spec `apresentacao-interativa-vendas` continuem valendo sem ajustes.

#### Acceptance Criteria

1. THE Sistema SHALL preservar a interface pública do hook `useDemoReservas` sem alterações de assinatura.
2. THE Sistema SHALL preservar as ações aceitas pelo `demoReducer` sem alterações de tipo ou semântica.
3. WHEN o `Apresentador` dispara qualquer sequência de `SELECT_AREA`, `SELECT_SLOT`, `CONFIRM` e `RESET`, THE Sistema SHALL produzir o mesmo estado final produzido pela implementação atual para a mesma sequência.
4. WHEN o `Apresentador` alterna entre as abas Morador e Síndico, THE Sistema SHALL preservar `areaSelecionada`, `slotSelecionado`, `reservasPorArea` e `ultimaConfirmacao`, conforme Property 7 do spec `apresentacao-interativa-vendas`.
5. THE Sistema SHALL preservar a estrutura de `role="radiogroup"` em volta dos três `AreaCard` e `role="radio"` em cada card.
6. THE Sistema SHALL preservar a estrutura de `role="group"` no `SlotGrid` das áreas reserváveis.
7. THE Sistema SHALL preservar o `role="status"` + `aria-live="polite"` na `ConfirmMessage`.
8. IF uma mudança visual exigir alteração de markup que quebre um teste existente em `src/features/demo/__tests__/`, THEN o Sistema SHALL atualizar o teste para refletir a nova estrutura mantendo a cobertura do comportamento original.

### Requisito 12: Responsividade e acessibilidade

**User Story:** Como Observador usando um notebook pequeno ou tablet, quero que a `Demo_Morador` continue utilizável e bonita, para que eu consiga explorar a apresentação em qualquer dispositivo.

#### Acceptance Criteria

1. WHERE o viewport tem largura menor que 768 pixels, THE Demo_Morador SHALL empilhar as colunas verticalmente com o `Mockup_Mobile` acima da `Coluna_Narrativa`.
2. WHERE o viewport tem largura maior ou igual a 768 pixels, THE Demo_Morador SHALL exibir as duas colunas lado a lado.
3. THE Mockup_Mobile SHALL centralizar-se horizontalmente na sua coluna em todos os viewports.
4. THE Demo_Morador SHALL atingir contraste WCAG AA em todos os pares texto/fundo dos elementos visíveis.
5. THE Demo_Morador SHALL manter navegação por teclado funcional em todos os elementos interativos: `AreaCard`, slots do `SlotGrid`, `ConfirmButton` e botão "Ver fluxo completo".
6. THE Demo_Morador SHALL preservar foco visível nos elementos interativos ao receber foco por teclado.
7. THE Demo_Morador SHALL excluir do fluxo de foco por teclado os elementos decorativos, incluindo `Status_Bar`, header decorativo, `Banner_Destaque` (se não interativo) e `Tab_Bar_Inferior`.

### Requisito 13: Propriedades testáveis do layout e do comportamento

**User Story:** Como mantenedor do código, quero propriedades explícitas que possam ser validadas automaticamente (PBT ou testes exemplares determinísticos), para que regressões dimensionais e funcionais sejam detectadas em CI.

#### Acceptance Criteria

1. FOR ALL sequências válidas de `DemoAction` aplicadas ao `initialDemoState`, o estado derivado pelo `demoReducer` SHALL ser idêntico ao produzido pela implementação atual (property: equivalência do reducer, atende Requisito 11).
2. FOR ALL `Area_Comum` selecionadas, a altura total do `Mockup_Mobile` medida em testes SHALL ser a mesma dentro de uma tolerância configurada (property: `Dimensoes_Fixas` do mockup).
3. FOR ALL estados do `ConfirmButton` (habilitado e desabilitado, com ambos os rótulos), a largura e a altura renderizadas SHALL ser constantes dentro de uma tolerância configurada (property: estabilidade do CTA).
4. FOR ALL presenças e ausências da `ConfirmMessage` para um mesmo estado anterior, a altura total do `Mockup_Mobile` SHALL ser idêntica (property: altura reservada para `ConfirmMessage`).
5. WHEN um teste exemplar renderiza a `Demo_Morador` em viewport 1024×768 e em viewport 375×812, THE Sistema SHALL passar todos os testes acessíveis já cobertos em `src/features/demo/__tests__/DemoSection.test.tsx`.
6. FOR ALL estados da `Demo_Morador`, a `Tab_Bar_Inferior` SHALL estar presente e na base do `Mockup_Mobile` (property: presença consistente da tab bar).

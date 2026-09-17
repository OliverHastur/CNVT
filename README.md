# Tentativa de descontração #
  Mini app/Site interativo, feito no básico (HTML/CSS/JS), sem build ou dependências, para publicação simples no github, só quero chamar essa moça pra sair de um jeito legal.

## Ideia de Fluxo
  1. **Início** - Confirmação sobre restrições alimentares/ alimentos que não gosta.
  2. **Clima** - Filtra o "Cardápio" de experiências com base no Mood dela, algo mais caseiro ou exploração.
  3. **Cardápio de Experiências** - Cards com as opções de encontro, com a possibilidade de desempate caso fique em dúvida entre duas opções.
  4. **Caixa de Sugestões** - Caixa em branco caso ela queira sugerir uma experiência diferente da que está na lista.
  5. **Calendário** - Ela escolhe o melhor dia para ela dentre os próximos fins de semana, podendo não escolher nenhum caso esteja ocupada, definindo depois a data.
  6. **Confirmação** - Resumo final para verificação e botão para enviar para o whatsapp.

## Personalização
  1. **Cardápio**: Edite em `js/data.js`, sabendo que cada experiência tem um título, descrição, emoji, `Vibe` (casa ou explorar, para filtragem), e um campo `isMystery` para encontros sem muita explicação do local.
  2. **Fins de semana**: Editáveis pela constante `WEEKENDS_TO_SHOW`, lá no topo de `js/app.js`, por padrão deizxei os próximos 4 fins de semanas constados a partir do dia de utilização, sempre a partir do navegador de quem abrir o link.
  3. **Cores e Fontes**: A parte mais complicada por causa do daltonismo, mas a ideia é manter as cores favoritas dela (Tons de roxo/lilás), caso necessário editar, as variáveis estão no topo de `css/style.css` no bloco `:root`.
  4. **Recebimento de repostas**: Coloque os dados no bloco `CONFIG` no topo de `js/app.js`:
    - `whatsappNumber`: coloque seu número com código de país e DDD (ex: `5571912341234`) para que ao confirmar, abra o whatsapp com a mensagem pronta para ser enviada (melhor opção).
    - `formspreeEndpoint` (completamente opcional, mas achei bacana), se quiser receber por email, basta criar uma conta em [formspree.io] e cole o endpoint.
    - pode ser utilizado sem configurar nada disso também, a resposta fica salva no `localStorage` do navegador utilizado como backup.

## rodar localmente
  Só abrir o `index.html`, sem instalação e/ou utilização de outros sistemas.

## Github Pages
  Como quero enviar, o jeito mais prático foi pelo Github Pages, para isso:

  1. Crie um repositório novo, independentemente se é público ou privado.
  2. No terminal, dentro da página:
    git remote add origin https://github.com/usuario/repositorio.git
    git add .
    git commit -m "qualquer coisa"
    git push -u origin main
  3. no github vá em settings -> pages
  4. Em source, selecione a branch correspondente e a oasta /root, depois clique em save

## Estrutura do projeto
  ```
  ├── index.html             # estrutura das coisas
  ├── css/
  │    └── style.css         # Parte visual
  ├── js/
  │    ├── data.js           # Cardápio de experiências
  │    └── app.js            # Lógica
  └── README.md
  ```
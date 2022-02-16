### Aplicação ABF

##### Como usar?
- As configurações importantes estão em `config/dataConfig.json`
- Executar a aplicação com `node index.js` ou `npm start`


### Entendendo a estrutura
- O diretório `componenets` é responsável por armazenar todos os controllers da abf, bossa, vtex e banco de dados(lowdb)
- O diretório `modules` é responsavel por armazenar os controllers de gerenciamento de pacotes e ferramentas desenvolvidas dentro da aplicação.
- O diretório `public` pode ser usado para inserir arquivos ou assets que podem ser acessados diretamente. Exemplo: (o arquivo está localizado em `public/teste.js`), e pode ser acessado via `www.meuprojeto.com/teste.js`
- O diretório `database` é responsavel por armazenar os bancos dos clientes e log de erros

### Onde edito as configurações de integração com a bossa?
- `componenets/bossaIntegration.js`
Nesse arquivo contem toda a configuração e integrações entre a api deles e a nossa ferramenta.

### Onde edito as configurações de integração da sharpspring?
- `componenets/abf.js`
Nesse arquivo contem toda a configuração e integrações entre a api deles e a nossa ferramenta.

### Onde edito as configurações de integração da vtex?
- `componenets/vtex.js`
Lá estará todas as funções e integrações entre a vtex, api da bossa, sharpspring, loja e a nossa aplicação.

A função inicial para analisar é a `async function checkStatus()`
Ela é a função **principal** e a primeira a ser chamada.
Ela é a que é chamada quando é feito o envio no OrderPlaced na plataforma.

```js
async function checkStatus(id, data, req, c){
...
```

### Rotas
- O arquivo de rotas fica em `modules/routes.js`

As principais rotas são:
- `/vtex/orderplaced/add`- É a primeira chamada que é feito da vtex do orderPlaced, a solicitação chega, após é criado um cache e é iniciada a função `checkStatus()`

Se der um problema, o começo de tudo é iniciar dessa rota, e ir vendo as funções que ela chama.

- `/automation/list/add` - É a rota de criação de contato no CRM, caso não esteja criando, verificar a função dessa rota e ir seguindo a diante.

### abf.js - Front End
`public/js/abf.js` - É responsável pelas funções do front.

- `orderPlacedSend(` - É responsável por enviar os dados do pedido para a aplicação
- `checkVal(` - É onde a gente faz a validação dos dados inseridos nos formulários
- `getUserSubscriptions(` - É a função que busca os dados do associado individualmente
- `addTopToCart(` - É a função responsável por inserir e tratar os dados no carrinho, tais como: remover itens, adicionar marketingTags, atualizar o storage e enviar para o carrinho.
- `checkUserLogged()` - Usada para verificar se o usuário está logado, mas pouco usado/relevante.

---

Após editar e salvar, fazer o commit no git e realizar o pull em produção.




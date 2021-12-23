const abf = new(require("../components/abf"))()

module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }
    /*
        -> Verificar se existe o contato
        -> Se tiver, ele só vai adiconar o lead na lista do produto
        -> Se não tiver, criar -> criar contato(nome, email telefone, data compra, produto que ele comprou(lista))
    */
    routerList(){
        this.router.get('/', async function (req, res) {
            let lead = {firstName:"Simples",lastName:"Inovação",emailAddress:"testedasimples@yopmail.com"};
            let list = 5172739074;

            let data = await abf.checkifHasOnList(req, lead, list);
            
            res.json(data);
        })
    }
    
}
const abf = new(require("../components/abf"))()
const cache = require('./cache');
const vtex = new(require('../components/vtex'))()

let database = [];

module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }

    routerList(){
        this.router.get('/', async function (req, res) {
            // let response = await abf.createLeadVtex(req, {firstName:"Simples",lastName:"Inovação",emailAddress:"testedasimples@yopmail.com"}, 5230840834)
            
            res.json({status: "salve"});
        })

        /*====== ROTAS BANCO TRIBECCA =====*/
        this.router.get('/database', async function (req, res) {
            // let c = cache.init();
            // if(c.check('database-tribecca')) return res.json({data: c.get('database-tribecca')});

            if(database.length <= 0){
                database = await abf.getClientsDatabase();
            }

            return res.json({data: database})
        })

        /*====== ROTAS MASTERDATA =====*/
        this.router.get('/vtex/masterdata/search', async function (req, res) {
            const { entity, email_principal } = req.query;

            if(!entity) return res.send("Falta o parâmetro entity na URL");
            if(!email_principal) return res.send("Falta o parâmetro email_principal na URL");

            let data = await vtex.masterData().searchDocumentByEmail("SI", email_principal)
            return res.json({data: data});
        })

        this.router.post('/vtex/masterdata/add', async function (req, res) {
            const { entity, objeto } = req.body;

            if(!entity) return res.send("Falta o parâmetro entity na URL");
            if(!objeto) return res.send("Falta o parâmetro objeto na URL");

            let data = await vtex.masterData().addDocument("SI", objeto);
            return res.json({data: data});
        })

        this.router.get('/vtex/masterdata/delete', async function (req, res) {
            const { entity, id } = req.query;

            if(!entity) return res.send("Falta o parâmetro entity na URL");
            if(!id) return res.send("Falta o parâmetro id na URL");

            let data = await vtex.masterData().deleteDocument(id, "SI")
            return res.json({data: data});
        })
        //https://developers.vtex.com/vtex-rest-api/reference/subscriptions-1#patch_api-rns-pub-subscriptions-id-items-itemid
        /*====== ROTAS ASSINATURAS =====*/
        this.router.get('/vtex/assinaturas/get', async function (req, res) {
            const { email } = req.query;

            if(!email) return res.send("Falta o parâmetro email na URL");

            let data = await (await vtex.subscriptions()).get(email)
            return res.json({data: data});
        })

        this.router.get('/vtex/assinaturas/getActives', async function (req, res) {
            const { email } = req.query;

            if(!email) return res.send("Falta o parâmetro email na URL");

            let data = await (await vtex.subscriptions()).getActives(email)
            return res.json({data: data});
        })
        
        /*====== ROTAS ORDER PLACED =====*/
        this.router.post('/vtex/orderplaced/add', async function (req, res) {
            const { data } = req.body;

            if(!data) return res.json({status: false});
            
            let c = cache.init();
            if(!c.check(`${data.orderId}-01`)) {
                c.set(`${data.orderId}-01`, data)
                await (await vtex.orders()).checkStatus(`${data.orderId}-01`, data, req, c);
            }

            return res.json({status: true});
        })
    }
    
}
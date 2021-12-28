const abf = new(require("../components/abf"))()
const cache = require('./cache');

module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }

    routerList(){
        this.router.get('/', async function (req, res) {
            let lead = {firstName:"Simples",lastName:"Inovação",emailAddress:"testedasimples@yopmail.com"};
            let list = 5172739074;

            let data = await abf.checkifHasOnList(req, lead, list);
            
            res.json(data);
        })

        this.router.get('/database', async function (req, res) {
            let c = cache.init();
            if(c.check('database-tribecca')) return res.json({data: c.get('database-tribecca')});
        })
    }
    
}
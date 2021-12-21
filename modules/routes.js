const abf = new(require("../components/abf"))()

module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }

    routerList(){
        this.router.get('/', async function (req, res) {
            const { data } = await abf.query('POST', {
                method: 'getLeads', 
                params: {
                    where: {emailAddress: 'tobias.carvalho7@gmail.com'},
                    limit: '10',
                    offset: '0',
                },
                id: req.id
            });
            
            if(data.error) return res.json(data.error);
            console.log(data)
            return res.json(data.result)
        })
    }
}
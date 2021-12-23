const abf = new(require("../components/abf"))()

module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }

    routerList(){
        this.router.get('/', async function (req, res) {
            let lead = {firstName:"Thiagoo",lastName:"Saless",emailAddress:"tsalesssssssssssssss@yopmail.com"};

            let data = await abf.getListMemberships(req, lead);
            
            res.json(data);
        })
    }
    
}
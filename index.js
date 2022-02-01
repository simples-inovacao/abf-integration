const app = require('./modules/express')
const cacheList = require("./modules/cacheList");
const vtex = new(require('./components/vtex'))()
const bossa = new(require('./components/bossa'))()
const database = new(require('./components/database'))('subscriptions')

cacheList.list();


app.listen(3000, async() => {
    console.log("ready")
    // await (await vtex.subscriptions()).save();
    
    // let data = {
    //     "parentOriginCode": 34991,
    //     "name": "SUporte TI",
    //     "email": "testedothiagodasimples@teste.com",
    //     "phone": "(11) 99999-7777",
    //     "cpf": "043.530.740-16",
    //     "idGroups": 39
    // };

    // let testAdd = await (await bossa.api()).add(data)
    // console.log(testAdd)

    // let dataPlan = {
    //     "parentOriginCode": 110,
    //     "email": "suportedeTI4@yopmail.com",
    //     "idGroups": 39
    // };
    
    // let user = await (await bossa.api()).find("ultimotestesimples@yopmail.com", 34991)
    // console.log(user)
    // if(!user) return await (await bossa.api()).add(data)
    // await (await bossa.api()).changePlan(dataPlan)
})
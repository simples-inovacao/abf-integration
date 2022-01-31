const app = require('./modules/express')
const cacheList = require("./modules/cacheList");
const vtex = new(require('./components/vtex'))()
const bossa = new(require('./components/bossa'))()

cacheList.list();


app.listen(3000, async() => {
    console.log("ready")
    // let data = {
    //     "parentOriginCode": 110,
    //     "name": "SUporte TI",
    //     "email": "simplesteste222@teste.com",
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
    
    // let user = await (await bossa.api()).find("eliasnovoteste@yopmail.com", 110)
    // console.log(user)
    // if(!user) return await (await bossa.api()).add(data)
    // await (await bossa.api()).changePlan(dataPlan)

    

    

    
})
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
    //     "email": "suportedeTI4@yopmail.com",
    //     "phone": "(11) 99999-7777",
    //     "cpf": "043.530.740-16",
    //     "idGroups": 99
    // };

    // let dataPlan = {
    //     "parentOriginCode": 110,
    //     "email": "suportedeTI4@yopmail.com",
    //     "idGroups": 39
    // };
    
    let user = await (await bossa.api()).find("hazardts@gmail.com")
    console.log(user)
    // if(!user) return await (await bossa.api()).add(data)
    // await (await bossa.api()).changePlan(dataPlan)


    

    
})
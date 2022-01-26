const app = require('./modules/express')
const cacheList = require("./modules/cacheList");
const vtex = new(require('./components/vtex'))()
const bossa = new(require('./components/bossa'))()

cacheList.list();


app.listen(3000, async() => {
    // console.log(await vtex.masterData().addDocument("SI", {"email_principal": "maria222@email.com","sku_da_assinatura": "sla", "marca": "SIMPLES TESTE", "cnpj": "50.645.242/0001-00"}))
    // let data = await (await vtex.subscriptions()).getActives("tsales@simplesinovacao.com");
    //     console.log(data)

    // await (await vtex.orders()).check()

    // let auth = await bossa.auth();
    // let insert = await bossa.createUser({
    //     "parentOriginCode": 110,
    //     "name": "SUporte TI",
    //     "email": "suportedeTI@yopmail.com",
    //     "phone": "(11) 99999-9999",
    //     "cpf": "043.530.740-16",
    //     "idGroups": 99
    // })

    // let search = await bossa.searchUser(110)

    // console.log(search)
})
const app = require('./modules/express')
const cacheList = require("./modules/cacheList");
const vtex = new(require('./components/vtex'))()

cacheList.list();


app.listen(3000, async() => {
    // console.log(await vtex.masterData().addDocument("SI", {"email_principal": "maria222@email.com","sku_da_assinatura": "sla", "marca": "SIMPLES TESTE", "cnpj": "50.645.242/0001-00"}))
    // console.log(await vtex.masterData().getDocuments("SI"))
})
const app = require('./modules/express')
const cacheList = require("./modules/cacheList");
const vtex = new(require('./components/vtex'))()
const bossa = new(require('./components/bossa'))()

cacheList.list();


app.listen(3000, async() => {
        
})
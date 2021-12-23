const axios = require('./modules/axios')
const app = require('./modules/express')
// const cronList = require('./modules/cronList');
const cache = require("./modules/cache");
const cacheList = require("./modules/cacheList");

app.listen(3000, async() => {
    cacheList.list();
})
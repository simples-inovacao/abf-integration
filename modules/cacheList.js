const cache = require('./cache');
const abf = new(require("../components/abf"))()

async function list(){
    async function databaseCache(){
        let c = cache.init();
        let database = await abf.getClientsDatabase();
        // console.log(database)
            if(!c.check('database-tribecca')) return c.set('database-tribecca', database)
    }

    // databaseCache();
    
    cache.on();
}

module.exports = {list:list}
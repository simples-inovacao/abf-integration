const cache = require('./cache');
const abf = new(require("../components/abf"))()

async function list(){
    async function databaseCache(){
        let c = cache.init();
            if(!c.check('database-tribecca')) return c.set('database-tribecca', await abf.getClientsDatabase())
    }

    databaseCache();
    
    cache.on();
}

module.exports = {list:list}
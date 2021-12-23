const { cache } = require("../configs/dataConfig.json");
const abf = new(require("../components/abf"))()

//https://www.npmjs.com/package/node-cache
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: cache.timeToDestroyCache, checkperiod: cache.timeToCheckCache } ); //600

class cacheSystem{
    set(key, obj){
        console.log(`[${key}] CACHE CRIADO`);
        return myCache.set(key, obj);
    }

    check(key){
        return myCache.has(key);
    }

    get(key){
        let v = myCache.get(key);

        if(v !== undefined){
            return v;
        }
    }

    on(){
        let self = this;
        myCache.on( "expired", async function( key, value ){
            switch(key){
                case "database-tribecca":
                    self.set('database-tribecca', await abf.getClientsDatabase())
                    console.log(`[${key}] CACHE RENOVADO`);
                break;
            }
        });
    }

    init(){
        return {
            set: this.set,
            get: this.get,
            check: this.check,
            on: this.on
        }
    }
}


module.exports = new cacheSystem();
const { cache } = require("../configs/dataConfig.json");
const abf = new(require("../components/abf"))()

//https://www.npmjs.com/package/node-cache
const NodeCache = require( "node-cache" );
const vtex = new(require("../components/vtex"));
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

    del(key){
        let v = myCache.del(key);
        
        console.log(`[${key}] CACHE DELETADO`);
        
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
                default:
                    console.log(key, "CACHE EXPIRADO - RENOVANDO");
                    await (await vtex.orders()).checkStatus(`${key}`, value);
                    self.set(key, value)
                break;
            }
        });
    }

    init(){
        return {
            set: this.set,
            get: this.get,
            check: this.check,
            on: this.on,
            delete: this.del
        }
    }
}


module.exports = new cacheSystem();
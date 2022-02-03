let low = require('lowdb');
FileSync = require('lowdb/adapters/FileSync');
var fs = require('fs');


module.exports = class database{
    getDatabase(name){
        try{
            let database = new FileSync(`database/${name}.json`);
            let db = low(database);
            // db.defaults({ data: []}).write()
            return db.defaults({ data: []}).get('data');
        }catch(e){
            console.log("Houve um erro ao acionar o banco")
            // console.log(e)
        }
    }

    createDefaults(){
        this.db.defaults({ data: [] }).write()
    }

    add(item){
        this.db.get('data').push(item).write();
        this.db.read();
    }

    check(get){
        return this.db.get('data').push(item).write()
    }

    find(){
        return this.db.get('data').value()
    }
    
    findBy(params){
        return this.db.get('data')
        .find(params)
        .value()
    }

    async update(search, data){
        await this.db.get('data').find(search).assign(data).write()
        this.db.read();
    }

    filterBy(params){
        return this.db.get('data').filter(params).value()
    }

    remove(params){
        return db.get('data').remove(params).write()
    }

    mixin(param){
        return this.db._.mixin(param)
    }
}
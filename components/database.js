const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


module.exports = class database{
    constructor(dbName){
        console.log("banco:", dbName)
        const adapter = new FileSync(`database/${dbName}.json`)
        const db = low(adapter)
        this.db_name = dbName;
        this.db = db;
    }

    createDefaults(){
        this.db.defaults({ data: [] }).write()
    }

    add(item){
        this.db.get('data').push(item).write();
        // this.db.read();
    }

    check(get){
        return this.db.get('data').push(item).write()
    }

    find(){
        return this.db.get('data').value()
    }
    
    async findBy(params){
        return await this.db.get('data').find(params).value()
    }

    async update(search, data){
        await this.db.get('data').find(search).assign(data).write()
        // this.db.read();
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
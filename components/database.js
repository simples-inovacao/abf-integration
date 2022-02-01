const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


module.exports = class database{
    constructor(dbName){
        const adapter = new FileSync(`database/${dbName}.json`)
        const db = low(adapter)
        this.db = db;
    }

    createDefaults(){
        this.db.defaults({ data: [] }).write()
    }

    add(item){
        return this.db.get('data').push(item).write()
    }

    check(get){
        return this.db.get('data').push(item).write()
    }

    find(){
        return this.db.get('data').value()
    }
    
    findBy(params){
        return this.db.get('data').find(params).value()
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
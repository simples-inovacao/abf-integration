const cron = require('./cron');
const abf = require('../components/abf')

function teste(){
    console.log("estou rodando o corn")
}

function list(){
    // cron.create('*/1 * * * *', teste, 0);
}

module.exports = {crons:list}
const cron = require('node-cron');

class cronManager{
    create(timer, obj, type){
        cron.schedule(timer, () => {
            obj();
        }, 
        {
            scheduled: true,
            timezone: "America/Sao_Paulo"
        });
    }

}

module.exports = new cronManager();
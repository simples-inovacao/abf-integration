const fetch = require('node-fetch');
var moment = require('moment');
const vtex = new(require('./vtex'))()

const { vtex: {usarname, app_key, app_token, site}, bossa, abf, tribecca} = require("../configs/dataConfig.json");

class relatory{
    async getList(req, res){
        async function getSubscriptions(){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions?page=1&size=15`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()
    
            return data;
        }

        async function getClient(id){
            let response = await fetch(`http://api.vtex.com/${usarname}/dataentities/CL/search?_fields=_all&_where=userId=${id}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()
    
            return data;
        }

        async function getOrder(id){
            let response = await fetch(`https://abf.vtexcommercestable.com.br/api/oms/pvt/orders/${id}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()
            
            return data;
        }

        let list = await getSubscriptions();

        const {filterByPeriod, startDate, finalDate} = req.body;

        if(filterByPeriod){
            list = list.filter(f => moment(f.createdAt).format("YYYY-MM-DD") >= startDate &&  moment(f.createdAt).format("YYYY-MM-DD") <= finalDate)
        }

        for(let item of list){
            // console.log(item.items[0].originalOrderId)
            let data = await getOrder(item.items[item.items.length-1].originalOrderId)
            item.assocId = data.marketingData.marketingTags[0];
        }

        res.render('result', {list: list});
    }
}

module.exports = relatory;
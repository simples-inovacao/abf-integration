const { abf: {account_id, account_secret} } = require("../configs/dataConfig.json");
const axios = require("../modules/axios")

module.exports = class abfIntegration{
    constructor(){
        this.apiURL = `http://api.sharpspring.com/pubapi/v1/?accountID=${account_id}&secretKey=${account_secret}`
    }

    async query(method, params){
        return await axios({
            method: method,
            url: this.apiURL,
            data: params
        })
    }
}
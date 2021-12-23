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

    /*======== INICIO DA CONFIGURAÇÃO DE LEAD ========*/
    async createLead(req, lead){
        const { data } = await this.query('POST', {
            method: 'createLeads', 
            params: {
                objects: [
                    lead
                ],
            },
            id: req.id
        });
    
        if(data.error.length > 0) return data.error;
        if(data.result.creates.length > 0) return data.result.creates;
    }

    async getLead(req, {emailAddress}){
        const { data } = await this.query('POST', {
            method: 'getLeads', 
            params: {
                where: {emailAddress: emailAddress},
                limit: 1
            },
            id: req.id
        });

        if(data.error) return data.error;
        if(data.result.lead > 0) return data.result.lead[0];
        return data.result.lead;
    }

    async checkLead(req, lead){
        let response = await this.getLead(req, lead);

        if(response.length <= 0){
            return await this.createLead(req, lead);
        }else{
            return response[0]
        }
    }
    /*======== FIM DA CONFIGURAÇÃO DE LEAD ========*/

    /*======== INICIO DA CONFIGURAÇÃO DE LISTA ========*/
    async getListMemberships(req, {emailAddress}){
        const { data } = await this.query('POST', {
            method: 'getListMemberships', 
            params: {
                emailAddress: emailAddress
            },
            id: req.id
        });
        
        return [data];
        // if(data.error) return data.error;
        // if(data.result.lead > 0) return data.result.lead[0];
        // return data.result.lead;
    }
    /*======== FIM DA CONFIGURAÇÃO DE LEAD ========*/
}
const { abf: {account_id, account_secret}, tribecca: {request_url, app_key, header} } = require("../configs/dataConfig.json");
const axios = require("../modules/axios")
const fetch = require('node-fetch');

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
            return response;
        }
    }
    /*======== FIM DA CONFIGURAÇÃO DE LEAD ========*/

    /*======== INICIO DA CONFIGURAÇÃO DE LISTA ========*/
    async checkifHasOnList(req, lead, list){
        let userLists = await this.getListMemberships(req, lead, list);
        let check = userLists.find(l => l.id === list);
        if(check) return {status: false, msg: "O contato já está na lista"};
        return this.addLeadAtList(req, lead, list);
    }

    async addLeadAtList(req, lead, list){
        const { emailAddress } = lead;
        const { data } = await this.query('POST', {
            method: 'addListMemberEmailAddress', 
            params: {
                listID: list,
                emailAddress: emailAddress
            },
            id: req.id
        });
        if(data.result === null) return data.error;
        return data.result.updates;
    }

    async getListMemberships(req, {emailAddress}, list){
        function filterList(obj){
            let arr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(typeof(obj[key]) === "object"){
                        arr.push(obj[key]);
                    }
                }
            }
            return arr;
        }

        const { data } = await this.query('POST', {
            method: 'getListMemberships', 
            params: {
                emailAddress: emailAddress
            },
            id: req.id
        });
        
        return filterList(data);
    }
    /*======== FIM DA CONFIGURAÇÃO DE LEAD ========*/

    async getClientsDatabase(){
        let response = await fetch(request_url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'apiKey': app_key
            }
        })
        let data = await response.json()

        return data;
    }
}
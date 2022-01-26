const { bossa: {host, username, password, parentOriginCode} } = require("../configs/dataConfig.json")
const axios = require("../modules/axios")

module.exports = class bossaIntegration{
    async query(url, method, params = null){
        let req = {
            method: method,
            url: url
        };

        if(params){
            req.data = params;
        }

        if(this.token){
            req.headers = {
                'Authorization': 'Bearer ' + this.token
              }
        }

        return await axios(req)
    }

    async auth(){
        try{
            let response = await this.query(host+'/login', 'POST', {
                username: username,
                password: password
            });
    
            const {data} = response;
    
            if(data.success){
                this.token = data.token;
            }
    
            return data;
        }catch{
            this.auth();
        }
    }

    async createUser(user){
        try {
            let response = await this.query(host+'/activate', 'POST', user);

            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    async searchUser(id){
        try {
            let response = await this.query(host+'/find/'+id, 'POST');
            
            return response.data;
        } catch (error) {
            console.log(error.data)
        }
    }

    async changePlan(data){
        try {
            let response = await this.query(host+'/changePlan', 'PUT', data);
            
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    async api(){
        let self = this;
        let auth = await this.auth();
        
        async function addUser(data){
            let insert = await self.createUser(data)

            return insert;
        }

        async function findUser(email){
            const { user } = await self.searchUser(parentOriginCode);

            return user.find(u => u.email === email);
        }

        async function changeUserPlan(data){
            return await self.changePlan(data);
        }

        return {
            add: addUser,
            find: findUser,
            changePlan: changeUserPlan
        }
    }
}
const { bossa: {host, username, password} } = require("../configs/dataConfig.json")
const axios = require("../modules/axios")

module.exports = class bossaIntegration{
    async query(url, method, params){
        let req = {
            method: method,
            url: url,
            data: params
        };

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
            console.log(error.data)
        }
    }

    async searchUser(id){
        try {
            let response = await this.query(host+'/find/parentOriginCode', 'POST', id);
            
            return response.data;
        } catch (error) {
            console.log(error.data)
        }
    }
}
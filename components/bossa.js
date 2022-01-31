const { bossa: {host, username, password, parentOriginCode, planos} } = require("../configs/dataConfig.json")
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
            console.log(insert)
            return insert;
        }

        async function findUser(email, originCode){
            const data = await self.searchUser(originCode);

            return data.user[0].find(u => u.email === email);
        }

        async function changeUserPlan(data){
            console.log("Plano Atualizado")
            return await self.changePlan(data);
        }

        async function createUpdateUser(data, planData, email, originCode){
            let oPlano = planos[planData]||planData
            if(!oPlano) return console.log("Plano não encontrado");
            if(!email) return console.log("Email não encontrado?");

            function formataNumeroTelefone(numero) {
                numero = numero.toString();
              var length = numero.length;
              var ddd = numero.substring(0, 2);
              var telefoneFormatado;
                
              if (length === 10) {
                  telefoneFormatado = '(' + ddd + ') ' + numero.substring(2, 6) + '-' + numero.substring(6, 10);
              } else if (length === 11) {
                  telefoneFormatado = '(' + ddd + ') ' + numero.substring(2, 7) + '-' + numero.substring(7, 11);
              }
              
                return telefoneFormatado;
            }

            let dataa = {
                "parentOriginCode": originCode,
                "name": data.firstName+' '+data.lastName,
                "email": email,
                "phone": formataNumeroTelefone(data.phone.replace("+55","")),
                "cpf": data.document,
                "idGroups": parseInt(oPlano)
            };
        
            let dataPlan = {
                "parentOriginCode": originCode,
                "email": email,
                "idGroups": parseInt(oPlano)
            };
            
            // let user = await findUser(email, originCode)
            // if(!user) return await addUser(dataa)
            await addUser(dataa)
            // let change = await changeUserPlan(dataPlan)
            console.log(dataa)
        }

        return {
            add: addUser,
            find: findUser,
            changePlan: changeUserPlan,
            createUpdateUser: createUpdateUser
        }
    }
}
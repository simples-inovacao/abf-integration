const { vtex: {usarname, app_key, app_token, site}, abf: { assinaturas }, bossa: {planos} } = require("../configs/dataConfig.json")
const fetch = require('node-fetch');
const cache = require("../modules/cache");
const bossa = new(require("./bossa"))();
const abf = new(require("./abf"))();

module.exports = class vtexIntegration{
    masterData(){
        async function getDocument(id, entityName = "SI"){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/dataentities/${entityName}/documents/${id}?_fields=_all`, {
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

        async function deleteDocument(id, entityName = "SI"){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/dataentities/${entityName}/documents/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Accept': 'application/vnd.vtex.ds.v10+json',
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
    
            return {status: (response.status === 204 ? "Deletado com sucesso!" : "Houve algum erro desconhecido")};
        }

        async function scrollDocuments(entityName = "SI"){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/dataentities/${entityName}/scroll?_fields=_all&_size=10`, {
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

        async function searchDocumentByEmail(entityName = "SI", email){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/dataentities/${entityName}/search?_fields=_all&_where=email_principal=${email}`, {
                method: 'GET',
                headers: { 
                    'Accept': 'application/vnd.vtex.ds.v10+json',
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()
    
            return data;
        }

        async function addDocument(entityName = "SI", obj){
            obj = JSON.parse(obj);
            let search = await searchDocumentByEmail("SI", obj.email_principal);
            if(search.length > 0){
                obj.id = search[0].id;
            }

            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/dataentities/${entityName}/documents?_fields=_all`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.vtex.ds.v10+json',
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                },
                body: JSON.stringify(obj)
            })
            let data = await response.json()
    
            return data;
        }

        return {
            getDocument: getDocument,
            scrollDocuments: scrollDocuments,
            searchDocumentByEmail: searchDocumentByEmail,
            addDocument: addDocument,
            deleteDocument: deleteDocument
        }
    }

    async subscriptions(){
        async function getSubscriptions(email){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions?customerEmail=${email}&page=1&size=15`, {
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

        async function getActiveSubscription(email){
            let data = await getSubscriptions(email);
            if(!data) return;

            data = data.filter(f => f.status === "ACTIVE")

            return data;
        }

        async function deleteItemFromSubscription(subId, itemId){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions/${subId}/items/${itemId}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()
    
            return data;
        }

        async function addItemOnSubscription(subId, skuId, quantity){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions/${subId}/items`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                },
                body: JSON.stringify({
                    skuId: skuId,
                    quantity: quantity

                })
            })
            let data = await response.json()
    
            return data;
        }

        async function updateStatusSubscription(subId, status){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions/${subId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                },
                body: JSON.stringify({
                    status: status
                })
            })
            let data = await response.json()
    
            return data;
        }

        async function cancelPlan(data){
            let activePlans = await getActiveSubscription(data.associate.vtex_email);
            let oldPlan = activePlans.find(ap => ap.id === data.planData.id)

            if(oldPlan){
                if(oldPlan.status !== "ACTIVE") return;
                // let status = await updateStatusSubscription(oldPlan.id, "CANCELED");
                console.log("Plano cancelado, status: ",status.status)
            }
        }

        return {
            get: getSubscriptions,
            getActives: getActiveSubscription,
            deleteItem: deleteItemFromSubscription,
            addItem: addItemOnSubscription,
            cancel: cancelPlan
        }
    }

    async orders(){
        let self = this;

        async function getOrders(){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/oms/pvt/orders?f_creationDate=creationDate%3A%5B2016-01-01T02%3A00%3A00.000Z%20TO%202024-01-01T01%3A59%3A59.999Z%5D&f_hasInputInvoice=false&orderBy=creationDate,desc&per_page=30&utc=-0300`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                }
            })
            let data = await response.json()

            if(data.list) return data.list;
    
            return data;
        }

        async function ordersManager(){
            let c = cache.init();
            // if(!c.check('database-tribecca')) return c.set('database-tribecca', await abf.getClientsDatabase())

            let orders = await getOrders()||[];
                orders = orders.filter(o => o.status !== 'canceled');

            for(let order of orders){
                const data = {
                    status: order.status,
                    statusDescription: order.statusDescription,
                    orderId: order.orderId,
                    clientName: order.clientName,
                    paymentNames: order.paymentNames

                }

                if(!c.check(`order-${order.orderId}`)) {
                    c.set(`order-${order.orderId}`, data)
                }
            }
        }

        async function getOrder(id){
            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/oms/pvt/orders/${id}`, {
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

        async function checkStatus(id, data, req, c){

            //https://help.vtex.com/pt/tutorial/tabela-de-status-de-pedidos-oms--frequentlyAskedQuestions_773
            let statusToCheck = [
                "approve-payment",
                "payment-approved",
                "ready-for-handling",
                "start-handling",
                "handling",
                "cancel",
                "canceled",
                "payment-pending",
                "window-to-cancel"
            ]

            const {status, clientProfileData, items} = await getOrder(id);

            console.log(`Cliente -> ${clientProfileData.firstName} ${clientProfileData.lastName}: ${status}`)

            let stt = statusToCheck.find(s => s == status);
            
            if(stt === "cancel" || stt === "canceled"){
                // ignora
                c.delete(id) // apaga cache
            }else if(stt && stt !== "payment-pending"){
                if(data.hasPlan){
                   
                    //createUpdateUser
                    console.log("Tem assinatura ativa")
                    await (await self.subscriptions()).cancel(data) // Cancelar assinatura anterior
                    await (await bossa.api()).createUpdateUser(clientProfileData, items[0].attachments[0].name, data.associate.vtex_email, data.associate.Id)
                    c.delete(id) // apaga cache
                }else{
                    if(items[0].id === "5"){
                        console.log("Plano gratis")
                        await (await bossa.api()).createUpdateUser(clientProfileData, items[0].id, data.associate.vtex_email, data.associate.Id)
                        console.log(data.associate.Id)
                        c.delete(id) // apaga cache
                        return;
                    }

                    console.log("Não tem assinatura ativa")
                    if(items[0].attachments[0]){
                        let plano = planos[items[0].attachments[0].name]
                        await (await bossa.api()).createUpdateUser(clientProfileData, plano, data.associate.vtex_email, data.associate.vtex_franquia_selected)
                    }
                    // Enviar dados para bossa?
                    c.delete(id) // apaga cache
                }
            }

            await abf.createLeadVtex(req, {firstName:clientProfileData.firstName,lastName:clientProfileData.lastName,emailAddress:data.associate.vtex_email}, data.crm_id, status, c, id) // Cria/Atualiza o lead e adiciona a lista
        }

        return {
            get: getOrders,
            getIndividual: getOrder,
            check: ordersManager,
            checkStatus: checkStatus,
        }
    }
}
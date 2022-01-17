const { vtex: {usarname, app_key, app_token, site} } = require("../configs/dataConfig.json")
const fetch = require('node-fetch');

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
            let data = await getSubscriptions("tsales@simplesinovacao.com");
            if(!data) return;

            data = data.find(f => f.status === "ACTIVE")||[]

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

        async function updateSubscription(data, plan, subId){
            let bbf = JSON.parse(`{"plan":{"frequency":{"periodicity":"${data.plan.frequency.periodicity}","interval":"${parseInt(data.plan.frequency.interval)}"},"id":"${plan}","purchaseDay":"${data.plan.purchaseDay}"},"shippingAddress":{"addressId":"${data.shippingAddress.addressId}","addressType":"${data.shippingAddress.addressType}"},"purchaseSettings":{"paymentMethod":{"paymentSystem":"${data.purchaseSettings.paymentMethod.paymentSystem}"}}}`);

            let bodyParams = {
                    id: plan,
                    plan: {
                        frequency: {
                            periodicity: data.plan.frequency.periodicity,
                            interval: parseInt(data.plan.frequency.interval)
                        },
                        purchaseDay: data.plan.purchaseDay,
                    },
                    shippingAddress: {
                        addressId: data.shippingAddress.addressId,
                        addressType: data.shippingAddress.addressType
                    },
                    purchaseSettings: {
                        paymentMethod: {
                            paymentSystem: data.purchaseSettings.paymentMethod.paymentSystem,
                        }
                    }
                }

            // return console.log(JSON.stringify(bodyParams))


            let response = await fetch(`https://${usarname}.vtexcommercestable.com.br/api/rns/pub/subscriptions/${subId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/*+json',
                    'Accept': 'text/plain',
                    'X-VTEX-API-AppKey': app_key,
                    'X-VTEX-API-AppToken': app_token
                },
                body: JSON.stringify(bbf)
            })
            let data2 = await response.json()
    
            return data2;
        }

        return {
            get: getSubscriptions,
            getActives: getActiveSubscription,
            update: updateSubscription,
            deleteItem: deleteItemFromSubscription,
            addItem: addItemOnSubscription,
        }
    }
}
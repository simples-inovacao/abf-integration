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
            deleteDocument: deleteDocument,
        }
    }
}
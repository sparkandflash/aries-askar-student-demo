import { apiCall } from './BaseUrl'

export async function getCredDefId() {
    try {
        let creddefID = await apiCall.get('/getCredDefId')
        return JSON.parse(JSON.stringify(creddefID.data))
    }
    catch (e) {
        return "id not found"
    }
}

export const getCredDetails = async (attrVal: string) => {
    const response = await apiCall.get(`/credAttr?value=${attrVal}`)
    return response
}




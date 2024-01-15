import { Attributes } from '@/studentData'
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

export async function issueCredential(/*credId: string, condId: string,*/ attributeData: Attributes) {
    try {
        let response = await apiCall.post(`/credentials/offer-credential`, {
            protocolVersion: "v2",
            credentialFormats: {
                anoncreds: {
                  
                    attributes: [
                        { name: 'id', value: attributeData.id },
                        { name: 'name', value: attributeData.name },
                        { name: 'course', value: attributeData.course },
                        { name: 'year', value: attributeData.year },
                        { name: 'mark', value: attributeData.mark },
                    ],
                    credentialDefinitionId: "q7ATwTYbQDgiigVijUAej:3:CL:183492:university-marks-card",
                }
            },
            autoAcceptCredential: "always",
            connectionId: "013ed475-459b-4977-80e2-94783edc5ab3"
        })
        return response
    }
    catch (e) {
        console.log("credential issue failed")
    }
}

export async function issueCredentialOffer(credId: string, attributeData: Attributes) {
    try {

        const response = await apiCall.post(`/credentials/create-offer`, {
            protocolVersion: "v1",
            credentialFormats: {
                indy: {
                    credentialDefinitionId: credId,
                    attributes: [
                        { name: 'id', value: attributeData.id },
                        { name: 'name', value: attributeData.name },
                        { name: 'course', value: attributeData.course },
                        { name: 'year', value: attributeData.year },
                        { name: 'mark', value: attributeData.mark },
                    ]
                }
            },
            autoAcceptCredential: "always",
            comment: "some comment",

        })
        return response.data.message
    }
    catch (e) {
        console.log("credential issue failed")
    }
}

export const getCredDetails = async (attrVal: string) => {
    const response = await apiCall.get(`/credAttr?value=${attrVal}`)
    return response
}




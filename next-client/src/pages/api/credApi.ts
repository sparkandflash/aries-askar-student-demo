import { Attributes, inviteValue } from "@/studentData"
import axios from "axios"
import { AgentMessage } from '@aries-framework/core';

export async function getCredDefId() {
    try{
    let creddefID = await axios.get('https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/getCredDefId')
    return JSON.parse(JSON.stringify(creddefID.data))
    }
    catch (e)
    {
        return "id not found"
    }
}

export async function issueCredential(credId:string, condId:string, attributeData:Attributes) {
    try {
      let response:AgentMessage = await axios.post(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/credentials/offer-credential`, {
            protocolVersion: "v1" || "v2",
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
            connectionId:condId

        }) 
        return response
    }
    catch (e) {
        console.log("credential issue failed")
    }
}

export async function issueCredentialOffer(credId:string, attributeData:Attributes) {
    try {
   
      const response = await axios.post(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/credentials/create-offer`, {
            protocolVersion: "v1" || "v2",
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

        }) 
        return response.data
    }
    catch (e) {
        console.log("credential issue failed")
    }
}

export const getDemoCredentialsByConnectionId = async (attrVal: string) => {
    const response = await axios.get(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/credAttr?value=${attrVal}`)
    return response
  }


  

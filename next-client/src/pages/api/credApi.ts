import { Attributes, inviteValue } from "@/studentData"
import axios from "axios"
import { AgentMessage } from '@aries-framework/core';

export async function getCredDefId() {
    try{
    let creddefID = await axios.get('http://localhost:5001/getCredDefId')
    return JSON.parse(JSON.stringify(creddefID.data))
    }
    catch (e)
    {
        return "id not found"
    }
}

export async function issueCredential(credId:string, condId:string, attributeData:Attributes) {
    try {
      let response:AgentMessage = await axios.post(`http://localhost:5001/credentials/offer-credential`, {
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
   
       return await axios.post(`http://localhost:5001/credentials/create-offer`, {
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
    }
    catch (e) {
        console.log("credential issue failed")
    }
}

export const getDemoCredentialsByConnectionId = async (attrVal: string) => {
    const response = await axios.get(`http://localhost:5001/credAttr?value=${attrVal}`)
    return response
  }
  

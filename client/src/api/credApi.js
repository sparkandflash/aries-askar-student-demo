import axios from "axios"

export async function getCredDefId() {
    try{
    let creddefID = await axios.get('http://localhost:5001/getCredDefId')
    return creddefID
    }
    catch (e)
    {
        return ""
    }
}

export async function issueCredential(credId, attributeData) {
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

export async function issueCredentialTOServer(credId, attributeData) {
    try {
    const body ={
        credId:credId,
        data:attributeData
    }
    return await axios.post(`http://localhost:5001/createCred`,body)
    }
    catch (e) {
        console.log("credential issue failed")
    }
}
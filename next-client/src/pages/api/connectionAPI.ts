import { AgentMessage } from "@aries-framework/core";
import axios from "axios"
import type { AxiosResponse } from 'axios'
/* export const createOobInvitation = (msg:any, agentName?: string, agentImageUrl?: string ): Promise<AxiosResponse> => {
    return axios.post('http://localhost:5001/oob/create-invitation', {
      autoAcceptConnection: true,
      message:msg
    })
  }
 {
  "domain": "didcomm://aries_connection_invitation?",
  "message": {
    "@id": "string",
    "@type": "string",
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "recordId": "string"
}*/



export async function makeInviteMSg(msg: AgentMessage) {
  try {
    const response = await axios.post(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/uniCreateInviteMsg`, msg);
    return response.data;  
  } catch (error) {
    console.log('Invitation creation failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
export async function makeInvite() {
  try {
    const response = await axios.get(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/createInvite`);
    return response  //Should return invite url and out of band id
  } catch (error) {
    console.log('Invitation creation failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getConnectionId(outOfBandId:string){
  const response = await axios.get(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/connections?outOfBandId=${outOfBandId}`);
  return response
}



import { AgentMessage } from "@aries-framework/core";
import axios from "axios"
import type { AxiosResponse } from 'axios'
import { message } from '@/studentData'



export async function makeOobInviteMSg() {
  try {
    const response = await axios.post('https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/oob/create-legacy-connectionless-invitation', {
      domain: "didcomm://aries_connection_invitation",
      message: message.message,
      recordId: "eb160fc2-9244-41a4-955a-10ed68964cbb"
    })
    return  response.data;
  } catch (error) {
    console.log('Invitation creation failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
/*
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
    const response = await axios.post(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/oob/create-legacy-connectionless-invitation`,
      {
        domain: "didcomm://aries_connection_invitation",
        message: message,
        recordId: 1
      });
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

export async function getConnectionId(outOfBandId: string) {
  const response = await axios.get(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/connections?outOfBandId=${outOfBandId}`);
  return response
}



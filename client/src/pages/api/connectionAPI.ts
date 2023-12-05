import { AgentMessage } from "@aries-framework/core";
import axios from "axios"
import type { AxiosResponse } from 'axios'
import { Attributes, message } from '@/studentData'

export async function makeOobInviteMSg() {

  try {
    const response = await axios.post(`https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/oob/create-legacy-connectionless-invitation`, {
      "recordId": message.id,
      "message": message.message,
      "domain": "https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io"
    })
    return response.data;
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

export async function shortenUrl(longUrl: string): Promise<string | undefined> {

  try {
    const response = await axios.post("https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/shorten", { longUrl });
    return response.data.shortUrl;
  } catch (error) {
    console.error('Error shortening URL:', error);
  }
}

export async function makeInvitationWMSG(attributeData:Attributes) {
  try {
    const response = await axios.post("https://5001-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io/acceptCred", { attributeData })
    console.log(response.data)
    return response.data;
  } catch (error) {
    //console.log('Invitation creation failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
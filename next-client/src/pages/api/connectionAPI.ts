import axios from "axios"
import type { AxiosResponse } from 'axios'
export const createOobInvitation = (msg:any, agentName?: string, agentImageUrl?: string ): Promise<AxiosResponse> => {
    return axios.post('http://localhost:5001/oob/create-invitation', {
      autoAcceptConnection: true,
      label: agentName,
      imageUrl: agentImageUrl,
      agentMessage:msg
    })
  }
  /* {
  "domain": "string",
  "message": {
    "@id": "string",
    "@type": "string",
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "recordId": "string"
}*/
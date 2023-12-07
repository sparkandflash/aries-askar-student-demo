//various agent functions- invite recevive etc

import {
  Agent,
  ConnectionEventTypes,
  DidExchangeState,
  ReceiveOutOfBandInvitationConfig,
  CreateOutOfBandInvitationConfig,
  OutOfBandRecord,
  BasicMessageEventTypes,
  BasicMessageRole,
  OutOfBandInvitation,
} from '@aries-framework/core'
import { ConnectionStateChangedEvent, BasicMessageStateChangedEvent, CreateOfferOptions, IndyCredentialFormat, V1CredentialService, V2CredentialService, AgentMessage } from '@aries-framework/core'
import { Attributes } from './types.js'


export const createNewInvitation = async (agent: Agent, url: string) => {
  const senderConfig: CreateOutOfBandInvitationConfig = {
    label: "xyz-university",
    imageUrl: "https://i.imgur.com/g3abcCO.png",
    autoAcceptConnection: true,
  }
  const outOfBandRecord = await agent.oob.createInvitation(senderConfig)
  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: url })
  }
}

export const createNewInvitationwithMsg = async (agent: Agent, id: string, attr: any, url: string) => {
  return await createCredOffer(agent, id, attr).then(async (data) => {
    console.log("CRED DATA: " +JSON.stringify(data))
    const senderConfig = {
      recordId: id,
      message: data.message,
      domain: url
    };
    const outOfBandRecord = await agent.oob.createLegacyConnectionlessInvitation(senderConfig);
    return {
      invitationUrl: outOfBandRecord.invitationUrl
    };
  });
};

export const createNewLegacyInvitation = async (agent: Agent, url: string) => {
  const senderConfig: CreateOutOfBandInvitationConfig = {
    label: "xyz-university",
    imageUrl: "https://i.imgur.com/ovIzDCt.jpeg",
    autoAcceptConnection: true,
  }
  const outOfBandRecord = await agent.oob.createLegacyInvitation(senderConfig)
  return {
    invitationUrl: outOfBandRecord.invitation.toUrl({ domain: url }),
    outOfBandRecord: outOfBandRecord.outOfBandRecord
  }
}

//for testing purposes
export const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const reciverConfig: ReceiveOutOfBandInvitationConfig = {
    label: "invite-recevied-from-uni",
    imageUrl: "https://i.imgur.com/ovIzDCt.jpeg",
    autoAcceptInvitation: true,
    autoAcceptConnection: true,
    reuseConnection: true
  }
  const record: OutOfBandInvitation = await agent.oob.parseInvitationShortUrl(invitationUrl)
  const { outOfBandRecord } = await agent.oob.receiveInvitation(record, reciverConfig)
  console.log(`out of band id: ` + outOfBandRecord.id)
  return outOfBandRecord
}
export const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
  agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
    if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      // the connection is now ready for usage in other protocols!
      console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)

      // Custom business logic can be included here
      // In this example we can send a basic message to the connection, but
      // anything is possible
      // We exit the flow
    }
  })
}
export async function getConnectionRecord(agent: Agent, outOfBandRecord: OutOfBandRecord) {
  if (outOfBandRecord.id) {
    console.log("connection unavailable")
  }
  const [connection] = await agent.connections.findAllByOutOfBandId(outOfBandRecord.id)
  if (!connection) {
    console.log("connection records unavailable")
  }
  return connection
}

export async function messageListener(agent: Agent, name: string) {
  agent.events.on(BasicMessageEventTypes.BasicMessageStateChanged, async (event: BasicMessageStateChangedEvent) => {
    if (event.payload.basicMessageRecord.role === BasicMessageRole.Receiver) {
      console.log(`\n${name} received a message: ${event.payload.message.content}\n`)

    }
  })
}

export async function createCredOffer(agent: Agent, credId: string, attributeData: Attributes) {
  const credFormat: CreateOfferOptions<[IndyCredentialFormat], [V1CredentialService, V2CredentialService<[IndyCredentialFormat]>]> = {
    protocolVersion: 'v1' || 'v2',
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
      },
    },
  }

  const credMsg = await agent.credentials.createOffer(credFormat)
  return credMsg
}



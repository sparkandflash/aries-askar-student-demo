//various agent functions- invite recevive etc
import {
  Agent,
  ConnectionEventTypes,
  DidExchangeState,
  ReceiveOutOfBandInvitationConfig,
  CreateOutOfBandInvitationConfig,
  OutOfBandRecord,
  BasicMessageEventTypes,
  BasicMessageRole
} from '@aries-framework/core'
import type { ConnectionStateChangedEvent, BasicMessageStateChangedEvent } from '@aries-framework/core'

// The startServer function requires an initialized agent and a port.
// An example of how to setup an agent is located in the `samples` directory.


const senderConfig: CreateOutOfBandInvitationConfig = {
  label: "invite-from-uni-to-student",
  imageUrl: "https://i.imgur.com/g3abcCO.png",
  autoAcceptConnection: true,

}
export const createNewInvitation = async (agent: Agent, url:string) => {

  const outOfBandRecord = await agent.oob.createInvitation(senderConfig)
  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain:url}),
    outOfBandRecord
  }
}
const reciverConfig: ReceiveOutOfBandInvitationConfig = {
  label: "invite-recevied-from-uni",
  imageUrl: "https://i.imgur.com/g3abcCO.png",
  autoAcceptInvitation: true,
  autoAcceptConnection: true,
  reuseConnection: true

}
export const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl, reciverConfig)
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


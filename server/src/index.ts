
import { startServer } from '@aries-framework/rest'
import { connect } from 'ngrok'

import {
  Agent,
  LogLevel,
  ConnectionEventTypes,
  DidExchangeState,
  ReceiveOutOfBandInvitationConfig,
  CreateOutOfBandInvitationConfig,
  HttpOutboundTransport,
  OutOfBandRecord,
  BasicMessage,
  OutOfBandInvitation,
  WsOutboundTransport,
  BasicMessageEventTypes,
  BasicMessageRole
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import type { InitConfig, ConnectionStateChangedEvent, BasicMessageStateChangedEvent } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer } from 'routing-controllers'
import { TestLogger } from './utils/logger.js'
import { BCOVRIN_TEST_GENESIS } from './utils/utils.js'
// The startServer function requires an initialized agent and a port.
// An example of how to setup an agent is located in the `samples` directory.
const logger = new TestLogger(process.env.NODE_ENV ? LogLevel.error : LogLevel.debug)
//logger copied from animo demo
process.on('unhandledRejection', (error) => {
  if (error instanceof Error) {
    logger.fatal(`Unhandled promise rejection: ${error.message}`, { error })
  } else {
    logger.fatal('Unhandled promise rejection due to non-error error', {
      error,
    })
  }
})

const initializeStudentAgent = async () => {
  //const endpoint = await connect(5002)
  const StudentagentConfig: InitConfig = {
    label: 'student',
    walletConfig: {
      id: 'student-wallet',
      key: 'demoagentbob00000000000000000000'
    },

    indyLedgers: [
      {
        id: 'BCOVRIN_TEST_GENESIS',
        genesisTransactions: BCOVRIN_TEST_GENESIS,
        isProduction: false,
      },
    ],
    endpoints: ['http://localhost:5002'],
    logger: logger,
    autoAcceptConnections: true,
    publicDidSeed: process.env.AGENT_PUBLIC_DID_SEED,
    // connectionImageUrl: 'https://i.imgur.com/g3abcCO.png',
  }
  const Studentagent = new Agent(
    StudentagentConfig, agentDependencies)
  Studentagent.registerInboundTransport(new HttpInboundTransport({ port: 5002 }))
  Studentagent.registerOutboundTransport(new HttpOutboundTransport())
  await Studentagent.initialize()
  return Studentagent
}


const initializeUniAgent = async () => {
  // const endpoint = await connect(5003)
  const uniagentConfig: InitConfig = {
    label: 'uni',
    walletConfig: {
      id: 'uni-wallet',
      key: 'demoagentacme0000000000000000000'
    },
    indyLedgers: [
      {
        id: 'BCOVRIN_TEST_GENESIS',
        genesisTransactions: BCOVRIN_TEST_GENESIS,
        isProduction: false,
      },
    ],
    endpoints: ['http://localhost:5003'],
    logger: logger,
    autoAcceptConnections: true,
    publicDidSeed: process.env.UNI_PUBLIC_DID_SEED,

    //  connectionImageUrl: 'https://i.imgur.com/g3abcCO.png',
  }

  const uniagent = new Agent(uniagentConfig, agentDependencies)
  uniagent.registerInboundTransport(new HttpInboundTransport({ port: 5003 }))
  uniagent.registerOutboundTransport(new HttpOutboundTransport())
  await uniagent.initialize()
  return uniagent
}
const senderConfig: CreateOutOfBandInvitationConfig = {
  label: "invite-from-uni-to-student",
  imageUrl: "https://i.imgur.com/g3abcCO.png",
  autoAcceptConnection: true,

}
const createNewInvitation = async (agent: Agent) => {

  const outOfBandRecord = await agent.oob.createInvitation(senderConfig)
  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://localhost:5002' }),
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
const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl, reciverConfig)
  console.log(`out of band id: ` + outOfBandRecord.id)
  return outOfBandRecord
}
const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
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
async function getConnectionRecord(agent: Agent, outOfBandRecord: OutOfBandRecord) {
  if (outOfBandRecord.id) {
    console.log("connection unavailable")
  }

  const [connection] = await agent.connections.findAllByOutOfBandId(outOfBandRecord.id)

  if (!connection) {
    console.log("connection records unavailable")
  }

  return connection
}

async function messageListener(agent: Agent, name: string) {
  agent.events.on(BasicMessageEventTypes.BasicMessageStateChanged, async (event: BasicMessageStateChangedEvent) => {
    if (event.payload.basicMessageRecord.role === BasicMessageRole.Receiver) {
     console.log(`\n${name} received a message: ${event.payload.message.content}\n`)
    }
  })
}

const run = async () => {
  const studentApp: Express = createExpressServer({
    cors: true,
  })

  const uniApp: Express = createExpressServer({
    cors: true,
  })


  const studentAgent = await initializeStudentAgent()
  const UNIAgent = await initializeUniAgent()
  let inviteUrl: string
  let bandRec: OutOfBandRecord | undefined;
  let bandRec2: OutOfBandRecord | undefined;
  function setInviteUrl(url: string, outOfBandRecord: OutOfBandRecord) {
    inviteUrl = url
    bandRec = outOfBandRecord
  }
  function setBandRec( outOfBandRecord: OutOfBandRecord){
    bandRec2 = outOfBandRecord
  }


  uniApp.get('/uniCreateInvite', async (req, res) => {
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(UNIAgent)
    console.log('uni creating invite')
    res.send('INVITE CREATED and CONNECTED. inviteUrl' + invitationUrl)
    setInviteUrl(invitationUrl, outOfBandRecord)
  })
  setupConnectionListener(UNIAgent, bandRec || {} as OutOfBandRecord, () => {

    console.log('We now have an active connection to use in the following tutorials')
  })
  setupConnectionListener(studentAgent, bandRec2 || {} as OutOfBandRecord, () => {

    console.log('We now have an active connection to use in the following tutorials')
  })
  studentApp.get('/invitationStatus', async (req, res) => {
    console.log('student recevied invite: ' + inviteUrl)

    console.log('Accepting the invitation as Student...')
    const outOfBandRecord = await receiveInvitation(studentAgent, inviteUrl)
    if (outOfBandRecord) {
      setBandRec(outOfBandRecord)
      res.send('INVITATION ACCEPTED')
    }

  })

  uniApp.get('/sendMsg:msg', async (req, res) => {
    //insert logic here
    let msg = req.params.msg
    const connectionRecord = await getConnectionRecord(UNIAgent, bandRec || {} as OutOfBandRecord)
    await UNIAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('uni sending msg')
    res.send('uni msg sent')

  })
  messageListener(UNIAgent, "university")
  studentApp.get('/sendMsg:msg', async (req, res) => {
    //insert logic here
    let msg = req.params.msg
    const connectionRecord = await getConnectionRecord(studentAgent, bandRec2 || {} as OutOfBandRecord)
    await studentAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('stu sending msg')
    res.send('stu msg sent')

  })
  messageListener(studentAgent,"student")



  await startServer(studentAgent, {
    port: 5000,
    app: studentApp,
    cors: true,
  })
  console.log('starting student server')
  await startServer(UNIAgent, {
    port: 5001,
    app: uniApp,
    cors: true,
  })
  console.log('starting uni server')
}

// A Swagger (OpenAPI) definition is exposed on http://localhost:3000/docs
run()

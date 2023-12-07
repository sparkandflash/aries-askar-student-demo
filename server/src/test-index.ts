import { startServer } from '@aries-framework/rest'
import { getConnectionRecord, messageListener, receiveInvitation, setupConnectionListener } from './utils/agentFunctions.js'
import { Agent, AutoAcceptCredential, AutoAcceptProof, HttpOutboundTransport, LogLevel, OutOfBandRecord, WsOutboundTransport } from '@aries-framework/core'
import type { InitConfig, WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer } from 'routing-controllers'
import { HttpInboundTransport, agentDependencies } from '@aries-framework/node'
import { BCOVRIN_TEST_GENESIS } from './utils/utils.js'
import { AgentCleanup } from './utils/AgentCleanup.js'
import { TestLogger } from './utils/logger.js'

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


//a test agent to test functioning of the uni server
const run = async () => {

  let bandRec2: OutOfBandRecord | undefined;
  function setBandRec(outOfBandRecord: OutOfBandRecord) {
    bandRec2 = outOfBandRecord
  }

  //student detail configuation
  const studentApp: Express = createExpressServer({
    cors: true,
  })
  const stuWConfig: WalletConfig = {
    id: 'stu-wallet',
    key: 'demoagentbob00000000000000000000'
  }
  const config: InitConfig = {
    label: "student",
    walletConfig: stuWConfig,

    indyLedgers: [
      {
        id: 'BCOVRIN_TEST_GENESIS',
        genesisTransactions: BCOVRIN_TEST_GENESIS,
        isProduction: false,
      },
    ],
    //endpoints: ['https://'+portNum+'-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io'], 
    endpoints: ["http://localhost:3004"],
    autoAcceptConnections: true,
    autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
    autoAcceptProofs: AutoAcceptProof.Always,
    useLegacyDidSovPrefix: true,
    publicDidSeed: process.env.AGENT_PUBLIC_DID_SEED,
    connectionImageUrl: 'https://i.imgur.com/g3abcCO.png',
    logger:logger
  }
  const studentAgent = new Agent(
    config, agentDependencies)
  studentAgent.registerInboundTransport(new HttpInboundTransport({ port: 3004 }))
  studentAgent.registerOutboundTransport(new HttpOutboundTransport())
  studentAgent.registerOutboundTransport(new WsOutboundTransport())

  await studentAgent.initialize()
  setupConnectionListener(studentAgent, bandRec2 || {} as OutOfBandRecord, () => {
    console.log('We now have an active connection to use in the following tutorials')
  })

  studentApp.get('/accept', async (req, res) => {
    let url = req.query.data as string
    console.log('student recevied invite: ' + url)
    console.log('Accepting the invitation as Student...')
    const outOfBandRecord = await receiveInvitation(studentAgent, url)
    if (outOfBandRecord) {
      setBandRec(outOfBandRecord)
      res.send('INVITATION ACCEPTED')
    }
  })

  studentApp.get('/sendMsg', async (req, res) => {
    let msg = req.query.msg as string
    const connectionRecord = await getConnectionRecord(studentAgent, bandRec2 || {} as OutOfBandRecord)
    await studentAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('stu sending msg')
    res.send('stu msg sent')
  })

  //danger command- deletes all connections, credentials and proofs
  studentApp.get('/cleanUp', async (req, res) => {
    await AgentCleanup(studentAgent)
    res.send("clean up done")
  })

  messageListener(studentAgent, "student")

  await startServer(studentAgent, {
    port: 3003,
    app: studentApp,
    cors: true,
  })
  console.log('starting student server')

}

// A Swagger (OpenAPI) definition is exposed on http://localhost:5000/docs 
run()
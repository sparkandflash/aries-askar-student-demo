//template to be reused for making multiple agents
// takes agent name, wallet configuartion details, port number, public did seeds as input


import {
  Agent,
  LogLevel,
  HttpOutboundTransport,
  AutoAcceptCredential,
  AutoAcceptProof,
  WsOutboundTransport,
  ConnectionInvitationMessage,
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import type { InitConfig, WalletConfig, } from '@aries-framework/core'
import { TestLogger } from './logger.js'
import { BCOVRIN_TEST_GENESIS } from './utils.js'
import { startNgrok } from './ngrokFunctions.js'

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


export async function initializeAgent(label: string, wConfig: WalletConfig, portNum: number, didSeed: string | undefined) {
 const endpoint = await startNgrok(portNum)
  const config: InitConfig = {
    label: label,
    walletConfig: wConfig,

    indyLedgers: [
      {
        id: 'BCOVRIN_TEST_GENESIS',
        genesisTransactions: BCOVRIN_TEST_GENESIS,
        isProduction: false,
      },
    ],
    //endpoints: ['https://'+portNum+'-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io'], 
    endpoints: [endpoint],
    logger: logger,
    autoAcceptConnections: true,
    autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
    autoAcceptProofs: AutoAcceptProof.Always,
    useLegacyDidSovPrefix: true,
    publicDidSeed: didSeed,
    connectionImageUrl: 'https://i.imgur.com/g3abcCO.png',
  }
  const agent = new Agent(
    config, agentDependencies)

  const httpInbound = new HttpInboundTransport({
    port: portNum,
  })
  httpInbound.app.get('/', async (req, res) => {
    if (typeof req.query.c_i === 'string') {
      try {
        const invitation = await ConnectionInvitationMessage.fromUrl(req.url.replace('d_m=', 'c_i='))
        res.send(invitation.toJSON())
      } catch (error) {
        res.status(500)
        res.send({ detail: 'Unknown error occurred' })
      }
    }
  })
  agent.registerInboundTransport(httpInbound)
  agent.registerOutboundTransport(new HttpOutboundTransport())
  agent.registerOutboundTransport(new WsOutboundTransport())

  await agent.initialize()
  return agent
}




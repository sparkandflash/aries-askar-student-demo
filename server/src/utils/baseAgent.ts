//template to be reused for making multiple agents
// takes agent name, wallet configuartion details, port number, public did seeds as input

import { AskarModule } from '@aries-framework/askar'
import * as core from '@aries-framework/core'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { AnonCredsCredentialFormatService, AnonCredsModule, LegacyIndyCredentialFormatService } from '@aries-framework/anoncreds'
import { IndyVdrAnonCredsRegistry, IndyVdrIndyDidRegistrar, IndyVdrIndyDidResolver, IndyVdrModule } from '@aries-framework/indy-vdr'
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import {
  Agent,
  LogLevel,
  HttpOutboundTransport,
  AutoAcceptCredential,
  AutoAcceptProof,
  WsOutboundTransport,
  ConnectionInvitationMessage,
  DidsModule,
  V2CredentialProtocol,
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import type { InitConfig, WalletConfig, } from '@aries-framework/core'
import { TestLogger } from './logger.js'
import { BCOVRIN_TEST_GENESIS } from './utils.js'
import { startNgrok } from './ngrokFunctions.js'

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
    //endpoints: ['https://'+portNum+'-sparkandfla-ariesaskars-qir1v1kkakh.ws-us106.gitpod.io'], 
    endpoints: [endpoint],
    logger: logger,
    connectionImageUrl: 'https://i.imgur.com/g3abcCO.png',
  }

  const agent = new core.Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      connections: new core.ConnectionsModule({ autoAcceptConnections: true }),
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: 'BCOVRIN_TEST_GENESIS',
            genesisTransactions: BCOVRIN_TEST_GENESIS,
            connectOnStartup: true,
          },
        ],
      }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry()],
      }),
      dids: new DidsModule({
        registrars: [new IndyVdrIndyDidRegistrar()],
        resolvers: [new IndyVdrIndyDidResolver()],
      }),
      credentials: new core.CredentialsModule({
        credentialProtocols: [
          new V2CredentialProtocol({
            credentialFormats: [new LegacyIndyCredentialFormatService(), new AnonCredsCredentialFormatService()],
          }),
        ],
      }),
    },
  })

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




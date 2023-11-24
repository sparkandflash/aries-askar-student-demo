
import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './baseAgent.js'
import { createNewInvitation, getConnectionRecord, messageListener, receiveInvitation, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord } from '@aries-framework/core'
import type { WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer } from 'routing-controllers'

const run = async () => {

  let inviteUrl: string
  let bandRec: OutOfBandRecord | undefined;
  function setInviteUrl(url: string, outOfBandRecord: OutOfBandRecord) {
    inviteUrl = url
    bandRec = outOfBandRecord
  }


  //uni detail configuration
  const uniApp: Express = createExpressServer({
    cors: true,
  })
  const uniWConfig: WalletConfig = {
    id: 'uni-wallet',
    key: 'demoagentacme0000000000000000000'
  }
  const UNIAgent = await initializeAgent("uni", uniWConfig, 5003, process.env.UNI_PUBLIC_DID_SEED)
  setupConnectionListener(UNIAgent, bandRec || {} as OutOfBandRecord, () => {
    console.log('We now have an active connection to use in the following tutorials')
  })

  // http://localhost:5001/uniCreateInvite/:http://localhost:5002 to test
  uniApp.get('/uniCreateInvite:url', async (req, res) => {
    let url = req.params.url
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(UNIAgent,url)
    console.log('uni creating invite')
    res.send('INVITE CREATED and CONNECTED. inviteUrl:  ' + invitationUrl)
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.get('/sendMsg:msg', async (req, res) => {
    let msg = req.params.msg
    const connectionRecord = await getConnectionRecord(UNIAgent, bandRec || {} as OutOfBandRecord)
    await UNIAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('uni sending msg')
    res.send('uni msg sent')
  })
  messageListener(UNIAgent, "university")
  await startServer(UNIAgent, {
    port: 5001,
    app: uniApp,
    cors: true,
  })
  console.log('starting uni server')
}

// A Swagger (OpenAPI) definition is exposed on  http://localhost:5001/docs
run()

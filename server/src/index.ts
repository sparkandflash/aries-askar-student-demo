import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './baseAgent.js'
import { createCredOffer, createNewInvitation, createNewInvitationwithMsg, createNewLegacyInvitation, getConnectionRecord, messageListener, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord } from '@aries-framework/core'
import type { AgentMessage, WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { CredDefService } from './controller/CredDefService.js'
import express from 'express'

const run = async () => {

  let inviteUrl: string
  let bandRec: OutOfBandRecord | undefined;
  function setInviteUrl(url: string, outOfBandRecord: OutOfBandRecord) {
    inviteUrl = url
    bandRec = outOfBandRecord
  }


  //uni detail configuration

  const uniApp: Express = createExpressServer({
    controllers: ['./controllers/**/*.ts', './controllers/**/*.js'],
    cors: true,
  })
  const uniWConfig: WalletConfig = {
    id: 'uni-wallet',
    key: 'demoagentacme0000000000000000000'
  }
  const UNIAgent = await initializeAgent("uni", uniWConfig, 5003, `testtesttesttesttesttesttesttest`)
  setupConnectionListener(UNIAgent, bandRec || {} as OutOfBandRecord, () => {
    console.log('We now have an active connection to use in the following tutorials')
  })

  // ---------SERVER API MAPPINGS-------START
  // http://localhost:5001/uniCreateInvite?url=http://localhost:5002 to test
  uniApp.get('/uniCreateInvite', async (req, res) => {
    let url = req.query.data as string
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(UNIAgent, url,)
    console.log('uni creating invite')
    res.send(invitationUrl)
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.get('/createInvite', async (req, res) => {
    const { outOfBandRecord, invitationUrl } =await createNewLegacyInvitation(UNIAgent, 'didcomm://aries_connection_invitation');
    console.log('uni creating legacy invite')
    res.send({
      url:invitationUrl,
      id: outOfBandRecord.id})
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.use(express.json()); //gives error if this line is removed
  uniApp.post('/uniCreateInviteMsg', async (req, res) => {
    try {
      let msg = req.body as AgentMessage;
      const { outOfBandRecord, invitationUrl } = await createNewInvitationwithMsg(UNIAgent, 'didcomm://aries_connection_invitation', msg);
      console.log('uni creating invite');
      res.send(invitationUrl);
      setInviteUrl(invitationUrl, outOfBandRecord);
    } catch (error) {
      console.error('Error creating invitation:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  uniApp.get('/sendMsg', async (req, res) => {
    let msg = req.query.msg as string
    const connectionRecord = await getConnectionRecord(UNIAgent, bandRec || {} as OutOfBandRecord)
    await UNIAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('uni sending msg')
    res.send('uni msg sent')
  })
  messageListener(UNIAgent, "university")

  const credDefService = new CredDefService(UNIAgent)
  useContainer(Container)
  Container.set(CredDefService, credDefService)

  uniApp.get('/getCredDefId', async (req, res) => {
    res.send(credDefService.getCredentialDefinitionIdByTag('university-marks-card'))
  })

  uniApp.post('/inviteStatus', async (req, res) => {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    
  });
  //------SERVER API MAPPINGS-------END


  await startServer(UNIAgent, {
    port: 5001,
    app: uniApp,
    cors: true,
  })
  console.log('starting uni server')
}

// A Swagger (OpenAPI) definition is exposed on  http://localhost:5001/docs
run()

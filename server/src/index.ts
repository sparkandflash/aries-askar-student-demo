import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './baseAgent.js'
import { createNewInvitation, createNewInvitationwithMsg, createNewLegacyInvitation, createNewLegacyNoConnectInvitation, getConnectionRecord, messageListener, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord, RecordNotFoundError } from '@aries-framework/core'
import type { AgentMessage, WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { CredDefService } from './controller/CredDefService.js'
import express from 'express'
import { connect } from 'ngrok'

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

  uniApp.use(express.json()); //gives error if this line is removed
  const credDefService = new CredDefService(UNIAgent)
  useContainer(Container)
  Container.set(CredDefService, credDefService)
  messageListener(UNIAgent, "university")

  // ---------SERVER API MAPPINGS-------START
  uniApp.get('/uniCreateInvite', async (req, res) => {
    let url = req.query.data as string
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(UNIAgent, url,)
    console.log('uni creating invite')
    res.send(invitationUrl)
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.get('/createInvite', async (req, res) => {
    const { outOfBandRecord, invitationUrl } = await createNewLegacyInvitation(UNIAgent, 'didcomm://aries_connection_invitation');
    console.log('uni creating legacy invite')
    res.send({
      url: invitationUrl,
      id: outOfBandRecord.id
    })
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.post('/createInviteMsg', async (req, res) => {
    try {
      let msg = req.body as AgentMessage;
      const { invitationUrl } = await createNewLegacyNoConnectInvitation(UNIAgent, {
       domain: 'didcomm://aries_connection_invitation',
       messages:msg});
      console.log('uni creating invite');
      res.send(invitationUrl);
    } catch (error) {
      console.error('Error creating invitation:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  uniApp.get('/sendMsg', async (req, res) => {
    let msg = req.query.msg as string
    let connectionId = req.query.connectionId as string; // Assuming connectionId is present in the URL

    await UNIAgent.basicMessages.sendMessage(connectionId, msg);
    console.log('uni sending msg')
    res.send('uni msg sent')
  })

  uniApp.get('/getCredDefId', async (req, res) => {
    res.send(credDefService.getCredentialDefinitionIdByTag('university-marks-card'))
  })

  uniApp.get('/credAttr', async (req, res) => {
    let value = req.query.value as string;
    try {
      const records = await credDefService.getAllCredentialsByAttribute(value);
      res.send(JSON.stringify(records));
    } catch (error) {
      res.send("error");
      if (error instanceof RecordNotFoundError) {
        throw new Error(`credentials for value "${value}" not found.`);
      }
      throw new Error(`something went wrong: ${error}`);
    }
  });

  uniApp.post('/inviteStatus', async (req, res) => {
    //EMIT Event when connection is established
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
  });

  uniApp.get('/credMsg', async (req, res) => {
    let value = req.query.value as string;
    try {
      const records = await credDefService.getCredMsg(value);
      res.send(JSON.stringify(records));
    } catch (error) {
      res.send("error");
      if (error instanceof RecordNotFoundError) {
        throw new Error(`credentials for value "${value}" not found.`);
      }
      throw new Error(`something went wrong: ${error}`);
    }
  });
  //------SERVER API MAPPINGS-------END
  const endpoint = await connect(5001)
  await startServer(UNIAgent, {
    port: 5001,
    app: uniApp,
    cors: true,

  })
  console.log('starting uni server')
}
// A Swagger (OpenAPI) definition is exposed on  http://localhost:5001/docs
run()

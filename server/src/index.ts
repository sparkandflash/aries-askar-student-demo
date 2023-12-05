import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './baseAgent.js'
import { createNewInvitation, createNewInvitationwithMsg, createNewLegacyInvitation, messageListener, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord, RecordNotFoundError } from '@aries-framework/core'
import type { WalletConfig } from '@aries-framework/core'
import type { Express, Request, Response, NextFunction } from 'express'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { CredDefService } from './controller/CredDefService.js'
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'ngrok'

const urlMap: { [shortId: string]: string } = {};

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
  const UNIAgent = await initializeAgent("uni", uniWConfig, 5006, `testtesttesttesttesttesttesttest`)
  setupConnectionListener(UNIAgent, bandRec || {} as OutOfBandRecord, () => {
    console.log('We now have an active connection to use in the following tutorials')
  })

  uniApp.use(express.json()); 
  //gives error if this line is removed
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

  uniApp.post('/acceptCred', async (req: Request, res: Response) => {
    try {
      let data = req.body
      console.log("ATTRIBUTES RECEVIED: "+ JSON.stringify(data.attributeData))
     let id = credDefService.getCredentialDefinitionIdByTag('university-marks-card')
     const { invitationUrl } = await createNewInvitationwithMsg(UNIAgent,id,data.attributeData);
      //console.log(invitationUrl);
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



  uniApp.use('/ssi', async (req, res) => {
    let shortId = req.query.id as string;
    // Check if the short URL exists
    if (urlMap.hasOwnProperty(shortId)) {
      const longUrl = urlMap[shortId];
      res.redirect(301, longUrl); // Redirect with status code 301 (permanent redirect)
    } else {
      res.status(404).send('Not Found');
    }
  });

  uniApp.post('/shorten', async (req: Request, res: Response) => {
    try {
      // Generate a unique ID for the short URL
      const shortId = uuidv4().substring(0, 8); // Use the first 8 characters of the UUID

      // Generate the short URL
      const shortUrl = endpoint+`/ssi?id=${shortId}`;

      // Store the mapping between short and long URLs
      const longUrl = req.body.longUrl as string;
      urlMap[shortId] = longUrl;

      // Send the short URL in the response
      res.json({ shortUrl });
    } catch (error) {
      console.error('Error shortening URL:');
      res.status(500).send('Internal Server Error');
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


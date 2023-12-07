import { createExpressServer, useContainer } from "routing-controllers";
import type { Express, Request, Response } from 'express'
import express from "express";
import { createNewInvitation, createNewInvitationwithMsg, createNewLegacyInvitation } from "./agentFunctions.js";
import { Agent, RecordNotFoundError } from "@aries-framework/core";
import { AgentCleanup } from "./AgentCleanup.js";
import { Container } from 'typedi'
import { v4 as uuidv4 } from 'uuid';
import { CredDefService } from "../controller/CredDefService.js";
const urlMap: { [shortId: string]: string } = {};

export function serverApp(agent: Agent, portnum: number, endpoint: string) {
    const App: Express = createExpressServer({
        controllers: ['./controllers/**/*.ts', './controllers/**/*.js'],
        cors: true,
    })

    App.use(express.json());
    const credDefService = new CredDefService(agent)
    useContainer(Container)
    Container.set(CredDefService, credDefService)

    // ---------SERVER API MAPPINGS-------START

    //use to make oob= invitation
    App.get('/uniCreateInvite', async (req, res) => {
        let url = req.query.data as string
        const { invitationUrl } = await createNewInvitation(agent, url,)
        console.log('uni creating invite')
        res.send(invitationUrl)
      
    })

    //use to make c_i= invitation, works for inviting wallet agents
    //not sure what to use as url
    App.get('/createInvite', async (req, res) => {
        const { outOfBandRecord, invitationUrl } = await createNewLegacyInvitation(agent, endpoint);
        console.log('uni creating legacy invite')
        res.send({
            url: invitationUrl,
            id: outOfBandRecord.id
        })
    })

    //wip - for making connectionless, credential offer invitation
    App.post('/acceptCred', async (req: Request, res: Response) => {
        try {
            let data = req.body
            console.log("ATTRIBUTES RECEVIED: " + JSON.stringify(data.attributeData))
            let id = credDefService.getCredentialDefinitionIdByTag('university-marks-card')
            const { invitationUrl } = await createNewInvitationwithMsg(agent, id, data.attributeData, 'didcomm://aries_connection_invitation');
            res.send(invitationUrl);
        } catch (error) {
            console.error('Error creating invitation:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    //send a message to other agents
    App.get('/sendMsg', async (req, res) => {
        let msg = req.query.msg as string
        let connectionId = req.query.connectionId as string;

        await agent.basicMessages.sendMessage(connectionId, msg);
        console.log('uni sending msg')
        res.send('uni msg sent')
    })

    //fetch credential definiation using tag
    App.get('/getCredDefId', async (req, res) => {
        res.send(credDefService.getCredentialDefinitionIdByTag('university-marks-card'))
    })

    //fetch credentials using attribute data
    App.get('/credAttr', async (req, res) => {
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

    //wip - check whether invite has been recevied or not
    App.post('/inviteStatus', async (req, res) => {
        //EMIT Event when connection is established
        res.writeHead(200, {
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        });
    });

    //use for receving short urls
    App.use('/ssi', async (req, res) => {
        let shortId = req.query.id as string;
        // Check if the short URL exists
        if (urlMap.hasOwnProperty(shortId)) {
            const longUrl = urlMap[shortId];
            res.redirect(301, longUrl);
        } else {
            res.status(404).send('Not Found');
        }
    });

    //makes long url into short
   App.post('/shorten', async (req: Request, res: Response) => {
        try {
          const shortId = uuidv4().substring(0, 8); 
          const shortUrl = endpoint + `/ssi?id=${shortId}`;
          const longUrl = req.body.longUrl as string;

          urlMap[shortId] = longUrl;
          res.json({ shortUrl });
        } catch (error) {
          console.error('Error shortening URL:');
          res.status(500).send('Internal Server Error');
        }
      });

    //danger command- deletes all connections, credentials and proofs
    App.get('/cleanUp', async (req, res) => {
        await AgentCleanup(agent)
        res.send("clean up done")
    })

    //------SERVER API MAPPINGS-------END
    return App
}
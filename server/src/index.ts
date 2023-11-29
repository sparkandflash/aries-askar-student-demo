import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './baseAgent.js'
import { createCredOffer, createNewInvitation, createNewInvitationwithMsg, getConnectionRecord, messageListener, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord } from '@aries-framework/core'
import type { AgentMessage, WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { CredDefService } from './controller/CredDefService.js'
import express from 'express'
import mysql from "mysql"
import bodyParser from "body-parser"

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sandu@66',
    database: 'college'
  });
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
  uniApp.use(bodyParser.json());
  const uniWConfig: WalletConfig = {
    id: 'uni-wallet',
    key: 'demoagentacme0000000000000000000'
  }
  const UNIAgent = await initializeAgent("uni", uniWConfig, 5003, `testtesttesttesttesttesttesttest`)
  setupConnectionListener(UNIAgent, bandRec || {} as OutOfBandRecord, () => {
    console.log('We now have an active connection to use in the following tutorials')
  })

  // http://localhost:5001/uniCreateInvite?url=http://localhost:5002 to test
  uniApp.get('/uniCreateInvite', async (req, res) => {
    let url = req.query.data as string
    const { outOfBandRecord, invitationUrl } = await createNewInvitation(UNIAgent, url,)
    console.log('uni creating invite')
    res.send(invitationUrl)
    setInviteUrl(invitationUrl, outOfBandRecord)
  })

  uniApp.use(express.json());
  uniApp.post('/uniCreateInviteMsg', async (req, res)=>{
    try {
      let msg = req.body as AgentMessage;
      let msgString = msg.toJSON
      if(!msg){
        console.log("msg not recevied")
      }
      else{
        console.log(msg)
      }
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

  uniApp.post('/createCred', async (req, res) => {
    const body = req.body as { credId: string; data: any }; // Assuming the body has { credId: string, data: any }
    const { credId, data } = body;

    const response = await createCredOffer(UNIAgent, credId, data)
    res.send(response)
  })

uniApp.get('/api/students/:rollNo', (req, res) => {
    const rollNo = req.params.rollNo;

    const query = 'SELECT * FROM students WHERE rollNo = ?';
    connection.query(query, [rollNo], (err, result) => {
      if (err) {
        res.json({ message: err.message });
      }
      else {
        res.json({ value: result });
      }
    });
  });

  uniApp.post('/api/addStudents', (req, res) => {
    const { rollno, name, cource, year, mark } = req.body.student;

    const insertQuery = 'INSERT INTO students (rollno, name, course, year, mark) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [rollno, name, cource, year, mark], (insertErr, result) => {
      if (insertErr) {
        res.json({ message: insertErr.message, value: 'Error' });
      } else {
        res.json({ message: 'Student added successfully', value: null });
      }
    });
  });

  await startServer(UNIAgent, {
    port: 5001,
    app: uniApp,
    cors: true,
  })
  console.log('starting uni server')
}

// A Swagger (OpenAPI) definition is exposed on  http://localhost:5001/docs
run()

import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './utils/baseAgent.js'
import {  getConnectionRecord, messageListener, receiveInvitation, setupConnectionListener } from './utils/agentFunctions.js'
import { OutOfBandRecord } from '@aries-framework/core'
import type { WalletConfig } from '@aries-framework/core'
import type { Express } from 'express'
import { createExpressServer } from 'routing-controllers'

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
  const studentAgent = await initializeAgent("student", stuWConfig, 5002, process.env.AGENT_PUBLIC_DID_SEED)
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
    let msg = req.query.msg  as string
    const connectionRecord = await getConnectionRecord(studentAgent, bandRec2 || {} as OutOfBandRecord)
    await studentAgent.basicMessages.sendMessage(connectionRecord.id, msg);
    console.log('stu sending msg')
    res.send('stu msg sent')
  })
  messageListener(studentAgent, "student")

  await startServer(studentAgent, {
    port: 5000,
    app: studentApp,
    cors: true,
  })
  console.log('starting student server')
  
}

// A Swagger (OpenAPI) definition is exposed on http://localhost:5000/docs 
run()
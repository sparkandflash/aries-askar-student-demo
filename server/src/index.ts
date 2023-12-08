import { startServer } from '@aries-framework/rest'
import { initializeAgent } from './utils/baseAgent.js'
import { messageListener } from './utils/agentFunctions.js'
import type { WalletConfig } from '@aries-framework/core'
import { startNgrok } from './utils/ngrokFunctions.js'
import { serverApp } from './utils/server-API.js'

const run = async () => {

  //university agent configuration
  const config: WalletConfig = {
    id: 'uni-wallet',
    key: 'demoagentacme0000000000000000000',
  }
  
  const UNIAgent = await initializeAgent("university-Agent", config, 3001, `testtesttesttesttesttesttesttest`)
  messageListener(UNIAgent, "university")
 
  //express server
  console.log('[server] starting university server')
  const endpoint = await startNgrok(3002)

serverApp(UNIAgent, 3002, endpoint).listen(3002)

 /* await startServer(UNIAgent, {
    port: 3002,
    app: serverApp(UNIAgent, 3002, endpoint),
    cors: true,
  }) */

}
// A Swagger (OpenAPI) definition is exposed on  http://localhost:5001/docs and endpoint/docs
run()


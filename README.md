
## details
### available APIs
- university agent:
- GET `/uniCreateInvite?data=` - uses createInvitation(), requires url to be given, returns invite URL.
- GET `/createInvite` - uses createLegacyInvitation(), returns invite URL.
- POST `/acceptCred` - still in development, it is supposed to generate a credential offer, and return a invitation URL that lets you obtain the credential. It needs credential attribute data as body.
- GET `/sendMsg?msg=&connectionId=` - send a message to another agent.
- GET `/getCredDefId` - fetch the credential definiation ID of the marks card.
- GET `/credAttr?value=` - fetch credentials based on attribute values.
- GET `/ssi?id=` - forwards to the long invite URL mapped to the id.
- POST `/shorten` - retuns a shoterned URL, it takes the long invitation url as the body.
- GET `/cleanUp` - clears all connection, credential, proofs data.

- test agent has `/sendMsg?msg=`, `/cleanUp`, and `/accept?data=` that accepts invitaions from other agents. 
### setting up
- `nvm use` 
- uses node 18
- `yarn install`
- for issues with libindy- refer the hyperledger resource document- [doc](https://docs.google.com/document/d/1BdrgOWiEzygZbG9nVPr2hbi-rALPZAREiB5lGPos57c/edit?usp=sharing)
- `npm i @types/yargs` in case of esm related issue - use it after setting node to version 18

### server and client start up commands
```
        yarn client - starts the front end nextjs client
        yarn server - starts the university, the issuing agent server
        yarn dev - start developmental server
        yarn test - start the test agent server
```

- localhost:3000 - front end client
- localhost:3001 - university agent endpoint | or use startNgrok 
- localhost:3002 - university agent server | or use startNgrok 
- localhost:3003 - test agent server
- localhost:3004 - test agent endpoint
- replace the localhost with the name of the hosting service for the uni agent



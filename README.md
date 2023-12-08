
## details

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



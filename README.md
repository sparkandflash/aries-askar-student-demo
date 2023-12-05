
## details

### implemented:
- uni sends invite to student
- uni and student can send msgs to eachother
- uni register ceritificate schema [without connection id]
- uni creates new certificates using schema [without conenction id]

### pending implementations
- ceritificate details is stored in db
- when student accepts- certificate is fetched from db, created by uni agent and sent to student along with connection invitation in form of qr code

### setting up
- `nvm use` 
- uses node 18
- `yarn install`
- for issues with libindy- refer the hyperledger resource document- [doc](https://docs.google.com/document/d/1BdrgOWiEzygZbG9nVPr2hbi-rALPZAREiB5lGPos57c/edit?usp=sharing)
- `npm i @types/yargs` in case of esm related issue - use it after setting node to version 18

### server and client start up commands
```
        yarn client - starts the front end client
        yarn server - starts the university, the issuing agent server
        yarn dev - start developmental server
```

- localhost:5001 - university server
- localhost:5003 - university agent endPoint 
- replace the localhost with the name of the hosting service for the uni agent



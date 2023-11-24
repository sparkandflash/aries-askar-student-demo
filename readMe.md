
- ## details

- ### implemented:
- uni sends invite to student
- uni and student can send msgs to eachother

- ### pending impelemnations 
- credential interations
- proof interations
- start stop functions
- multiple student interactions

- ### setting up
- `nvm use` uses node 18
- `yarn install`
- `yarn start` - starts the server
- `yarn client` - starts the angular front end

- ### server apis

- localhost:5001 - university agent
- localhost:5000 - student agent

- localhost:5001/uniCreateInvite:url

- returns the invite url from university for the given url, which is the recevier end point url

- localhost:5000/accept:url
- student accepts the invite from university

- localhost:5001/sendMsg:msg
- university sends msg to the student

- localhost:5000/sendMsg:msg
- student sends msg to the university
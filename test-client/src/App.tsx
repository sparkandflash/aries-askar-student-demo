import * as React from "react"
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Text,
  theme,
} from "@chakra-ui/react"
import axios, { AxiosResponse } from 'axios';
import { useState } from "react";


export const App = () =>{
  const [value, setValue] = React.useState('')
  const [invite, setInvite] = React.useState('')
  const [apiResponse, setApiResponse] = useState<AxiosResponse | null>(null);
  //function to generate the invite
  async function genInvite(){
    try{
    const inviteUrl = await axios.get(`http://localhost:5001/uniCreateInvite?data=${value}`) 
    setApiResponse(inviteUrl);
    }catch (e){
      console.log(e)
    }
  }
  async function accInvite(){
    try{
    const response = await axios.get(`http://localhost:5000/accept?data=${invite}`) 
    setApiResponse(response);
    }catch (e){
      console.log(e)
    }
  }
   return(
  
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
        <Input isRequired={true}  onChange={e => setValue(e.target.value)}  placeholder='enter url' />
        university <Button  onClick={genInvite}>generate invite</Button>
     <Text fontSize="sm">   {JSON.stringify(apiResponse?.data)}</Text>
    </Box>
    <Box>
    <Input isRequired={true}  onChange={e => setInvite(e.target.value)}  placeholder='enter invite url' />
        student <Button  onClick={accInvite}>accept invite</Button>
    </Box>
  </ChakraProvider>
)}


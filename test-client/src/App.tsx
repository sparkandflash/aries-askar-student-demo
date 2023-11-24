import * as React from "react"
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"




export const App = () =>{
  const [value, setValue] = React.useState('')
  const [invite, setInvite] = React.useState('')
  //function to generate the invite
  async function genInvite(){

  }
   return(
  
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
        <ColorModeSwitcher justifySelf="flex-end" />
        <Input isRequired={true}  value={value} placeholder='enter url' />
        university <Button onClick={genInvite}>generate invite</Button>
        {invite}
    </Box>
  </ChakraProvider>
)}


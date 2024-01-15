import {
  TabPanel, Tab, TabList, Tabs, TabPanels, Button, Text
} from "@chakra-ui/react"
import Prof from "@/components/ProfessorForm"
import Stud from "@/components/StudentForm"
import { clearData } from "./api/connectionAPI"
import { useEffect, useState } from "react"
import { getCredDefId } from "./api/credApi"

export default function Home() {
  const [credDefId, setCredDefId] = useState("")
  async function getCredId() {
    let id = await getCredDefId()
    setCredDefId(id)
}
useEffect(() => {
  // const source = new EventSource('http://localhost:5001/inviteStatus')
  //  source.onmessage = e => console.log(e.data)
  getCredId()
}, [])

  return (
    <>
        <Button onClick={clearData} >clear data</Button>
   <Tabs size='md' variant='enclosed' align="center">

            <TabList>
                <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Professsor</Tab>
                <Tab _selected={{ color: 'white', bg: 'blue.400' }}>Student</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                 <Prof />
                </TabPanel>
                <TabPanel>
                   <Stud />
                </TabPanel>
            </TabPanels>
        </Tabs>
        status: {credDefId!="id not found"? <div>connected to server, <Text><b>cred def id:</b> {credDefId}</Text></div>:<div>not connected to server</div>}
   
    </>
  )
}

import {
  TabPanel, Tab, TabList, Tabs, TabPanels
} from "@chakra-ui/react"
import Prof from "@/components/ProfessorForm"
import Stud from "@/components/StudentForm"

export default function Home() {
  return (
    <>
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
    </>
  )
}

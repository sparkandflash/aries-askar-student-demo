import {
    TabPanel, Tab, TabList, Tabs, TabPanels
} from "@chakra-ui/react"
import Prof from './Professor.js';
import Stud from './student.js';
function Search() {
    return (

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
    )
}
export default Search
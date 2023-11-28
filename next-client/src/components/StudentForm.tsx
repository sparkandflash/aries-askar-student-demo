//add student form here
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import randomStudentData, { Attributes, Cred, StudentData, inviteValue } from '../studentData'; // Assuming you have a type/interface named StudentData

import {
    FormLabel, HStack, VStack, Input, Button, Text, Box
} from "@chakra-ui/react"
import { getCredDefId, issueCredential } from '@/pages/api/credApi';
import { makeInvite } from '@/pages/api/connectionAPI';
function stud() {
    const [rollId, setRollId] = useState<string>('');
    const [credStatus, setCredStatus] = useState(false)
    const [cred, setCred] = useState<Cred[] | undefined>()
    const [student, setStudent] = useState<StudentData | undefined>()
    const [credDefId, setCredDefId] = useState("")

    const [inviteUrl, setInviteUrl] = useState<string>('');
    async function getCredId() {
        let id = await getCredDefId()
        setCredDefId(id)
    }

    function findStudentByRoll() {
        //replace this with function to fetch the student data from db
        const foundStudent = randomStudentData.find((student) => student.RollNo.toString() === rollId);
        if (foundStudent) {
            setCredStatus(true)
            setCred(foundStudent.creds)
            setStudent(foundStudent)
        }
        else {
            setCredStatus(false)
        }
    }
    //import the aries asakar action action functions- give it cred details
    async function acceptCred(attr:Attributes) {
        //function to send attribute data, return with agent msg, then a function to send agentmsg, return with invite url- sent into a qr code pop up
        try {
        
                await issueCredential(credDefId,attr).then(async (response: any) => {
                    console.log(response.data.message);
                   
                    let invite = await makeInvite(response.data.message);
                    setInviteUrl(invite)
                console.log(invite);
                });
            
        
        } catch (error) {
            console.error("Error accepting credential:", error);
        }
    }

    useEffect(() => {
        getCredId()
    }, [])


    return (
        <VStack marginTop={40} spacing={5} direction='column'>
               {inviteUrl?<QRCode value={inviteUrl} />:<div></div> }
            <HStack>
                <FormLabel width={20}>RollNo</FormLabel>
                <Input width={350} onChange={e => setRollId(e.target.value)} placeholder='Your ID' />
            </HStack>
            <Button onClick={findStudentByRoll} colorScheme='blue'>Continue</Button>
            {credStatus ? <div>
                <Text>student no: {student ? student.RollNo : 0}</Text>
                {
                    cred && cred.map((item: Cred) => {

                        return (

                            item.attributes && item.attributes.map((item: Attributes) => {
                                return (

                                    <Box key={item.name}>
                                      
                                        name:{item.name} | course:{item.course} | id:{item.id}  <Button onClick={() => acceptCred(item)} >accept</Button>
                                    </Box>
                                )
                            }
                            )
                        )
                    }
                    )
                }
            </div> : <div> </div>}
            <Text>cred def id: {credDefId}</Text>
            <Text>invite: {inviteUrl}</Text>
        
        </VStack>

    )
}
export default stud
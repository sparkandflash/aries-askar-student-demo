//add student form here
import React, { useEffect, useState } from 'react'
import randomStudentData, { Attributes, Cred, StudentData, inviteValue } from '../studentData'; // Assuming you have a type/interface named StudentData

import {
    FormLabel, HStack, VStack, Input, Button, Text, Box
} from "@chakra-ui/react"
import { getCredDefId, issueCredential } from '@/pages/api/credApi';
import { AgentMessage } from '@aries-framework/core';
function stud() {
    const [rollId, setRollId] = useState<string>('');
    const [credStatus, setCredStatus] = useState(false)
    const [cred, setCred] = useState<Cred[] | undefined>()
    const [student, setStudent] = useState<StudentData | undefined>()
    const [credDefId, setCredDefId] = useState("")
    const [agentMsg, setAgentMsg] = useState()
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
    async function acceptCred(credData: Attributes) {
        try {
            await issueCredential(credDefId, credData).then(async (response: any) => {
                console.log(response);

                let value: inviteValue = {
                    url: "",
                    agentMsg: response,
                };

                //let invite = await makeInvite(value);
             //   console.log(invite);
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
                                        name:{item.name} | course:{item.course} | id:{item.id}  <Button onClick={e => acceptCred(item)} >accept</Button>
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
        </VStack>

    )
}
export default stud
//add student form here
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';
import randomStudentData, { Attributes, Cred, StudentData } from '../studentData'; // Assuming you have a type/interface named StudentData
import useAttributes from '../hooks/useAttributes';
import {
    FormLabel, HStack, VStack, Input, Button, Text, Box
} from "@chakra-ui/react"
import { getCredDefId, getDemoCredentialsByConnectionId, issueCredential } from '@/pages/api/credApi';
import { getConnectionId, makeInvite } from '@/pages/api/connectionAPI';
function stud() {
    const [rollId, setRollId] = useState<string>('');
    const [credStatus, setCredStatus] = useState(false)
    const [cred, setCred] = useState<Cred[] | undefined>()
    const [student, setStudent] = useState<StudentData | undefined>()
    const [credDefId, setCredDefId] = useState("")
    const [connId, setConnId] = useState("")
    const { attributes, setAttributesData } = useAttributes();
    const [inviteUrl, setInviteUrl] = useState<string>('');
    async function getCredId() {
        let id = await getCredDefId()
        setCredDefId(id)
    }

    async function findStudentByRoll() {
        //replace this with function to fetch the student data from postGres
        const studentCred = await getDemoCredentialsByConnectionId(rollId)
        console.log(JSON.stringify(studentCred.data[0].credentialAttributes))
        setAttributesData(studentCred.data[0].credentialAttributes)
        const foundStudent = randomStudentData.find((student) => student.RollNo.toString() === rollId);
        if (foundStudent) {
            setCredStatus(true)
            setInviteUrl("")
           // setCred(foundStudent.creds)
           setCred(foundStudent.creds)
            setStudent(foundStudent)
        }
        else {
            setCredStatus(false)
        }
    }
    //import the aries asakar action action functions
    async function acceptinvite() {
        //function to return with invite url- sent into a qr code pop up
        try {
            await makeInvite().then(async (response: any) => {
                setInviteUrl(response.data.url)
                console.log(response.data.id)
                setConnId(response.data.id)
            });
        } catch (error) {
            console.error("Error accepting invite:", error);
        }
    }
    useEffect(() => {
       // const source = new EventSource('http://localhost:5001/inviteStatus')
      //  source.onmessage = e => console.log(e.data)
        getCredId()
    }, [])

    async function acceptCred(attr:Attributes){
    await getConnectionId(connId).then(async (data: any) => {
        console.log(data)
        issueCredential(credDefId,"1a1fe909-bdee-4fb8-9f00-be7e326ecd72", attr)
    });
    }

    return (
        <VStack marginTop={30} spacing={5} direction='column'>
            {inviteUrl ? <QRCodeCanvas size={400} value={inviteUrl} /> : <div></div>}
            <HStack>
                <FormLabel width={20}>RollNo</FormLabel>
                <Input width={350} onChange={e => setRollId(e.target.value)} placeholder='Your ID' />
            </HStack>
            <Button onClick={findStudentByRoll} colorScheme='blue'>Continue</Button>
            {credStatus ? <div>
                <Button onClick={acceptinvite} >connect</Button>
                <Text>student no: {student ? student.RollNo : 0}</Text>  
                                    <Box>
                                        name: {attributes.name} | course: {attributes.course} | id: {attributes.id} <Button onClick={() => acceptCred(attributes)}>accept</Button>
                                    </Box>
            </div> : <div> </div>}
            <Box width="70%"><Text>cred def id: {credDefId}</Text>
                <Text>invite: {inviteUrl}</Text></Box>
        </VStack>

    )
}
export default stud
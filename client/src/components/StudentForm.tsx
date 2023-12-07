//add student form here
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';
import randomStudentData, { Attributes, Cred, StudentData, url } from '../studentData'; // Assuming you have a type/interface named StudentData
import useAttributes from '../hooks/useAttributes';
import {
    FormLabel, HStack, VStack, Input, Button, Text, Box, FormControl,
} from "@chakra-ui/react"

import { getCredDefId, getCredDetails, issueCredential } from '@/pages/api/credApi';
import { getConnectionId, makeInvitationWMSG, makeInvite, makeOobInviteMSg, shortenUrl } from '@/pages/api/connectionAPI';
import { ConnectionInvitationMessage } from '@aries-framework/core';
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
        if (rollId != "") {
            const studentCred = await getCredDetails(rollId)
            console.log(studentCred.data.length)
            if (studentCred.data.length > 0) {
                setAttributesData(studentCred.data[0].credentialAttributes)
                setCredStatus(true)
                setInviteUrl('')
            }
            else {
                setCredStatus(false)
            }
        }
    }
    //import the aries asakar action action functions
    async function acceptinvite() {
        //function to return with invite url- sent into a qr code pop up
        try {
            await makeInvite().then(async (response: any) => {
                setInviteUrl(response.data.url)

                console.log(JSON.stringify(response.data.url))
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

    async function acceptCred(attr: Attributes) {
        try {
        //   await makeInvitationWMSG(attr)
        //    await makeOobInviteMSg().then(async (response: any) => {  
                const urlS = await shortenUrl(url.replace(/oob=/, 'c_i='))
               if (urlS != undefined) {
                   console.log(urlS)
                    setInviteUrl(urlS)
                }
           // });
        } catch (error) {
            console.error("Error accepting invite:", error);
        }
    }

    

    return (
        <VStack marginTop={30} spacing={5} direction='column'>
            {inviteUrl ?
                <div><QRCodeCanvas size={600} value={inviteUrl} /> <br />
                    <Box width="70%"> <Text>invite: {inviteUrl}</Text> </Box>
                </div> : <div></div>}
            <HStack>
                <FormControl isRequired={true}>
                    <FormLabel width={20}>RollNo</FormLabel>
                    <Input width={350} onChange={e => setRollId(e.target.value)} placeholder='Your ID' />
                </FormControl>
            </HStack>
            <Button onClick={findStudentByRoll} colorScheme='blue'>find</Button>
            {credStatus ? <div>
                <Button onClick={acceptinvite} >connect</Button>
                <Text>student no: {attributes.id}</Text>
                <Box>
                    name: {attributes.name} | course: {attributes.course} | id: {attributes.id} <Button onClick={() => acceptCred(attributes)}>accept</Button>
                </Box>
            </div> : <div> </div>}
            <Box width="70%"><Text>cred def id: {credDefId}</Text>
            </Box>
        </VStack>

    )
}
export default stud
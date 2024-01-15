//add student form here
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';
import { Attributes, url } from '../studentData';
import useAttributes from '../hooks/useAttributes';
import {
    FormLabel, HStack, VStack, Input, Button, Text, Box, FormControl,
} from "@chakra-ui/react"

import { getCredDefId, getCredDetails, issueCredential } from '@/pages/api/credApi';
import { makeInvite } from '@/pages/api/connectionAPI';

function stud() {
    const [rollId, setRollId] = useState<string>('');
    const [credStatus, setCredStatus] = useState(false)
    const [credDefId, setCredDefId] = useState("")
    const { attributes, setAttributesData } = useAttributes();
    const [inviteUrl, setInviteUrl] = useState<string>('');

  
    async function findStudentByRoll() {
        //replace this with function to fetch the student data from postGres
        if (rollId != "") {
            const studentCred = await getCredDetails(rollId)
            console.log(studentCred.data.length)
            if (studentCred.data.length > 0) {

                setAttributesData(studentCred.data[0].credentialAttributes)
                setCredStatus(true)
                setInviteUrl('')
            }else{
                setCredStatus(false)
                setInviteUrl('')
                setAttributesData(null)
            }
        }
        else{
            setCredStatus(false)
            setInviteUrl('')
            setAttributesData(null)
        }
    }
    //import the aries asakar action action functions
    async function acceptinvite() {
        //function to return with invite url- sent into a qr code pop up
        try {
            await makeInvite().then(async (response: any) => {
                setInviteUrl(response.data.url)

                console.log(JSON.stringify(response.data.url))
            });
        } catch (error) {
            console.error("Error accepting invite:", error);
        }
    }
   
    async function acceptCred(attr: Attributes) {
        try {
            await issueCredential(attr)
          // await makeInvitationWMSG(attr)
        //    await makeOobInviteMSg().then(async (response: any) => {     
                    setInviteUrl(url)
           // });
        } catch (error) {
            console.error("Error accepting invite:", error);
        }
    }

    function Cretificate(attribute:Attributes){
        return(
            <Box>
            name: {attribute.name} | course: {attribute.course} | id: {attribute.id} | marks: {attribute.mark} | year: {attribute.year} <Button onClick={() => acceptCred(attribute)}>accept</Button>
        </Box>
        )
    }


    return (
        <VStack marginTop={30} spacing={5} direction='column'>
            <Text>generate qr code for the invite url</Text>
            <Input width={650} onChange={e => setInviteUrl(e.target.value)} placeholder='inviteUrl' />
            {inviteUrl ?
                <div><QRCodeCanvas size={400} value={inviteUrl} /> <br />
                </div> : <div></div>}
            <Button onClick={acceptinvite} >connect to another agent</Button><Button onClick={() => setInviteUrl('')}>cancel</Button>

            <Box padding="10px" width="70%" borderWidth={1}>
                <Text fontSize={20}>deBug</Text>
                <VStack>
                    <HStack>
                        <FormControl isRequired={true}>
                            <FormLabel width={20}>RollNo</FormLabel>
                            <Input width={350} onChange={e => setRollId(e.target.value)} placeholder='Your ID' />
                        </FormControl>
                    </HStack>
                    <Button onClick={findStudentByRoll} colorScheme='blue'>find</Button>
                    {credStatus ? <div>

                        <Text>student no: {attributes.id}</Text>
                        <Cretificate {...attributes} />
                    </div> : <div> </div>}
                   
                    <Text noOfLines={1}><b>short invite URL:</b> {inviteUrl}</Text>
                </VStack>

            </Box>
        </VStack>
    )
}
export default stud
import {
    FormLabel, Text, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { getCredDefId, issueCredentialOffer } from '@/pages/api/credApi';
import { makeInvitationWMSG, makeOobInviteMSg, shortenUrl } from "@/pages/api/connectionAPI";
import useAttributes from "@/hooks/useAttributes";

function Prof() {
    const [form, setForm] = useState({ name: '', id: '', course: '', year: '', mark: '' })
    const { attributes, setAttributesData } = useAttributes();
    const [credId, setCredId] = useState('')
    async function getCredId() {
        let id = await getCredDefId()
        if (id == "") {
            setCredId("server not available")
        }
        setCredId(JSON.parse(JSON.stringify(id)))
        console.log(JSON.stringify(id))
    }

    async function addNewCerd() {
        //TODO:  send this form data to a db first
        let response = await makeInvitationWMSG(form)
        const url = await shortenUrl(response)
        console.log(url)
        //store the response somewhere
    }
    useEffect(() => {
        getCredId()
    }, [])

    return (
        <VStack marginTop={20} spacing={8} direction='column'>
            <HStack>

                <FormLabel width={20}>RollNo</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, id: e.target.value })} placeholder='Your ID' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Name</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='Your Name' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Course</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, course: e.target.value })} placeholder='Course' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Year</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, year: e.target.value })} placeholder='year' />
            </HStack>
            <HStack>
                <FormLabel width={20}>TotalMarks</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, mark: e.target.value })} placeholder='Mark' />
            </HStack>
            <Button onClick={addNewCerd} colorScheme='blue'>Continue</Button>

        </VStack>
    )
}
export default Prof



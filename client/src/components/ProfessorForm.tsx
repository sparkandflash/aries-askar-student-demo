import {
    FormLabel, Text, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { getCredDefId } from '@/pages/api/credApi';
import { makeInvitationWMSG, shortenUrl } from "@/pages/api/connectionAPI";
import useAttributes from "@/hooks/useAttributes";

function Prof() {
    const [form, setForm] = useState({ name: '', id: '', course: '', year: '', mark: '' })
    const [urlS, setUrl] = useState('')
 
    async function addNewCerd() {
        setUrl("")
        //TODO:  send this form data to a db first- roll id and crednetial offer invite urls
        let response = await makeInvitationWMSG(form)
        const url = await shortenUrl(response)
        console.log(url)
        if(url){
        setUrl(url)}
        //store the response somewhere
    }
 
    return (
        <VStack marginTop={20} spacing={8} direction='column'>
            <Text>{urlS}</Text>
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



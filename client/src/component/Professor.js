import { useState, useEffect } from "react";
import {
    FormLabel, Text, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import { getCredDefId, issueCredential } from "../../../next-client/src/api/credApi";

function Prof() {
    const [credId, setCredId] = useState('')
    const [form, setForm] = useState({ name: '', id: '', course: '', year: '', mark: '' })
    //fetch the schema id for this before calling this

    async function getCredId() {
        let id = await getCredDefId()
        if (id == "") {
            setCredId("server not available")
        }
        setCredId(JSON.parse(JSON.stringify(id.data)))
        console.log(JSON.stringify(id.data))
    }
    const updates = {
        name: form.name,
        id: form.id,
        course: form.course,
        mark: form.mark,
        year: form.year,
    }


    async function addNewCerd() {
        //TODO:  send this form data to a db first
        let response = issueCredential(credId, form)
        console.log(response)

        //move this function to student obtaining the certificate flow, where cerificate details are fetched from db

    }
    useEffect(() => {
        getCredId();
    }, [])
    return (
        <VStack marginTop={20} spacing={8} direction='column'>
            <Text> cred definition id: {credId}</Text>
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
                <Input width={350} onChange={e => setForm({ ...form, id: e.target.value })} placeholder='year' />
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
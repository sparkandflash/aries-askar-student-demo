import {
    FormLabel, Text, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import React from "react"


function Prof() {
    const [form, setForm] = React.useState({ name: '', id: '', course: '', year: '', mark: '' })

    async function upDateCredDB(){
        //TODO:  send this form data to a db first
      }
      

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
                <Input width={350} onChange={e => setForm({ ...form, id: e.target.value })} placeholder='year' />
            </HStack>
            <HStack>
                <FormLabel width={20}>TotalMarks</FormLabel>
                <Input width={350} onChange={e => setForm({ ...form, mark: e.target.value })} placeholder='Mark' />
            </HStack>
            <Button onClick={upDateCredDB} colorScheme='blue'>Continue</Button>

        </VStack>
    )
}
export default Prof



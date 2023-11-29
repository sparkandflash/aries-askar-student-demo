import {
    FormLabel, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import { profaction } from "../core/actions";
import React, { useState } from 'react';
function Prof() {
    const [rollno, setRollno] = useState('');
    const [name, setName] = useState('');
    const [cource, setCource] = useState('');
    const [year, setYear] = useState('');
    const [mark, setMark] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        profaction.invite({ rollno, name, cource, year, mark }).then(
            (user) => {
                alert(user.message);
                if (user.value == null) {
                    setRollno('');
                    setName('');
                    setCource('');
                    setYear('');
                    setMark('');
                }
            }
        )
    };
    const handleClear = () => {
        setRollno('');
        setName('');
        setCource('');
        setYear('');
        setMark('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack marginTop={20} spacing={8} direction='column'>
                <HStack>
                    <FormLabel width={20}>RollNo</FormLabel>
                    <Input width={350} value={rollno} placeholder='Your ID' onChange={(e) => setRollno(e.target.value)} required />
                </HStack>
                <HStack>
                    <FormLabel width={20}>Name</FormLabel>
                    <Input width={350} value={name} placeholder='Your Name' onChange={(e) => setName(e.target.value)} required />
                </HStack>
                <HStack>
                    <FormLabel width={20}>Course</FormLabel>
                    <Input width={350} value={cource} placeholder='Course' onChange={(e) => setCource(e.target.value)} required />
                </HStack>
                <HStack>
                    <FormLabel width={20}>Year</FormLabel>
                    <Input width={350} value={year} placeholder='year' onChange={(e) => setYear(e.target.value)} required />
                </HStack>
                <HStack>
                    <FormLabel width={20}>TotalMarks</FormLabel>
                    <Input width={350} value={mark} placeholder='Mark' onChange={(e) => setMark(e.target.value)} required />
                </HStack>
                <HStack>
                    <Button type="submit" colorScheme='blue' >Continue</Button>
                    <Button onClick={handleClear} colorScheme='blue' >Clear</Button>
                </HStack>
                <FormLabel></FormLabel>
            </VStack>
        </form>
    )
}
export default Prof
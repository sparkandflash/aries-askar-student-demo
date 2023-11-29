import {
    FormLabel, HStack, VStack, Input, Button
} from "@chakra-ui/react"
import { stuaction } from "../core/actions";
import React, { useState } from 'react';

function Stud() {
    const [rollno, setRollno] = useState('');
    const [apiResponse, setApiResponse] = useState(null);

    const handleInputChange = (e) => {
        setRollno(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setApiResponse(null);
        stuaction.studentID(rollno).then((user) => {
            if (user.message != undefined) {
                alert(user.message);
            }
            else {
                if (user.value == '') {
                    alert('No marks card of student is available');
                }
                else {
                    setApiResponse(user.value);
                }
            }
        })
    };

    const handleClear = () => {
        setRollno('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack marginTop={40} spacing={5} direction='column'>
                <HStack>
                    <FormLabel width={20}>RollNo</FormLabel>
                    <Input type="text" width={350} value={rollno} placeholder='Your ID' onChange={handleInputChange} required />
                </HStack>
                <HStack>
                    <Button type="submit" colorScheme='blue' >Continue</Button>
                    <Button onClick={handleClear} colorScheme='blue' >Clear</Button>
                </HStack>
            </VStack>
            {apiResponse && (
                <div>
                    &nbsp;
                    &nbsp;
                    <ul>
                        {apiResponse.map((student) => (
                            <li key={student.rollno}>
                                &nbsp;
                                RollNo: {student.rollno} - Name: {student.name} - Cource: {student.course} - Year: {student.year} - Mark: {student.mark}&nbsp;&nbsp;
                                <Button>Accept</Button>
                            </li>

                        ))}
                    </ul>
                </div>
            )}
        </form>
    )
}
export default Stud
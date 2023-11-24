import {
    FormLabel, HStack, VStack, Input, Button
} from "@chakra-ui/react"
function stud() {
    return (

        <VStack marginTop={40} spacing={5} direction='column'>
            <HStack>
                <FormLabel width={20}>RollNo</FormLabel>
                <Input width={350} placeholder='Your ID' />
            </HStack>
            <Button colorScheme='blue'>Continue</Button>
        </VStack>
    )
}
export default stud
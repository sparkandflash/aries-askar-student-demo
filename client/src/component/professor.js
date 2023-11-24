import {
    FormLabel, HStack, VStack, Input, Button
} from "@chakra-ui/react"
function prof() {
    return (
        <VStack marginTop={20} spacing={8} direction='column'>
            <HStack>
                <FormLabel width={20}>RollNo</FormLabel>
                <Input width={350} placeholder='Your ID' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Name</FormLabel>
                <Input width={350} placeholder='Your Name' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Course</FormLabel>
                <Input width={350} placeholder='Course' />
            </HStack>
            <HStack>
                <FormLabel width={20}>Year</FormLabel>
                <Input width={350} placeholder='year' />
            </HStack>
            <HStack>
                <FormLabel width={20}>TotalMarks</FormLabel>
                <Input width={350} placeholder='Mark' />
            </HStack>
            <Button colorScheme='blue'>Continue</Button>
        </VStack>
    )
}
export default prof
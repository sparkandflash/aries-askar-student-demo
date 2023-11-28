import { AgentMessage } from "@aries-framework/core";

export interface Attributes {
    name: string;
    id: string;
    course: string;
    year: string;
    mark: string;
}
export interface inviteValue {
    url:string;
    agentMsg:AgentMessage
}
export interface Cred {
    attributes: Attributes[];
}

export interface StudentData {
    name:String,
    RollNo: string;
    creds: Cred[];
}

const randomStudentData: StudentData[] = [
    {
        name: 'john',
        RollNo: '1',
        creds: [
            {
                attributes: [
                    { name: 'John Doe', id: 'A123456', course: 'Computer Science', year: '3', mark: '95' },
                    // Add more credentials for the first student
                ],
            },
            {
                attributes: [
                    { name: 'John Doe', id: 'A123450', course: 'english', year: '2', mark: '100' },
                    // Add more credentials for the first student
                ],
            },
        ],
    },
    {
        name: 'jane',
        RollNo: '2',
        creds: [
            {
                attributes: [
                    { name: 'Jane Doe', id: 'B789012', course: 'Mathematics', year: '2', mark: '85' },
                    // Add more credentials for the second student
                ],
            },
            // Add more credentials for the second student
        ],
    },
    // Add more students as needed
];

export default randomStudentData;

export interface Attributes {
    name: string;
    id: string;
    course: string;
    year: string;
    mark: string;
}
export interface Cred {
    attributes: Attributes[];
}

export interface StudentData {
    name: String,
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

export const url = "https://e208-35-230-114-54.ngrok.io/ssi?id=78ad5707"

export const message = {
    "id":"80bb0a2b-3bea-4fb2-957e-f52a461d139d",
    "message": {
        "@type": "https://didcomm.org/issue-credential/1.0/offer-credential",
        "@id": "c666ae7a-d192-4581-bba0-0d5a5d2cb887",
        "comment": "some comment",
        "credential_preview": {
            "@type": "https://didcomm.org/issue-credential/1.0/credential-preview",
            "attributes": [
                {
                    "name": "id",
                    "value": "6"
                },
                {
                    "name": "name",
                    "value": "ghfgh"
                },
                {
                    "name": "course",
                    "value": "gtr"
                },
                {
                    "name": "year",
                    "value": "rgd"
                },
                {
                    "name": "mark",
                    "value": "rfdgd"
                }
            ]
        },
        "offers~attach": [
            {
                "@id": "libindy-cred-offer-0",
                "mime-type": "application/json",
                "data": ""
                
            }
        ]
    }
   }


export default randomStudentData;
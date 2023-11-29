import { stuservice } from '../services';
export function studentID(data) {
    return (
        stuservice.studentID(data)
            .then(
                (user) => {
                    return user;
                })
    );
}
const stuaction = {
    studentID
}
export default stuaction;


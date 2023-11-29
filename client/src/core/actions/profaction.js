import { profservice } from '../services';
export function invite(student) {
    return (
        profservice.addStudent(student)
            .then(
                (user) => {
                    return user;
                })
    )
}
const profaction = {
    invite
}
export default profaction;


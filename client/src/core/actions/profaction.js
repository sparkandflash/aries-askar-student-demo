import  { profservice } from '../services';
export function invite(resCb) {
     return (dispatch) => {
        dispatch(request('CATEGORY_DETAILS', {}));
        profservice.invite()
            .then(
                (user) => { 
                    console.log("Res",user);
                    if (user) {
                        dispatch(success('CATEGORY_DETAILS', user.data));
                      }
                      resCb(user.data);
                    },
                    (error) => {
                        resCb(error.toString);
                    }
            );
     };
}
function success(type, data){
    return { type: type, payload : data }
}
function request(type, value) {
    return { type: type, payload: value };
}
const profaction = {
    invite
}
export default profaction;

 
import axios, { AxiosResponse } from 'axios';
import React ,{ useState } from 'react';
import { async } from 'rxjs';

async function invite() {
  // const [data,setData] = useState();
  const requestoptions = {
    method: "GET"
  };
    const response = `http://localhost:5001/uniCreateInvite?url=http://localhost:5002`;
    return fetch(response, requestoptions)
      .then((data) => {
        console.log("Category Details: ", data);
        return data;
      });
       
        
       
         //setData(response.data);
}
// async function accInvite() {
//     var val ="123";
//     const response = await axios.get(`http://localhost:5000/accept?data=${val}`)
// .then((response) => {
// // 'response' is still an AxiosResponse
// console.log(response.data);
// })
// console.log('Data:', response.data);
// }


const profservice = {
    invite
}
export default profservice
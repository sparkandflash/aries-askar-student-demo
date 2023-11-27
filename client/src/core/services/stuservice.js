import axios, { AxiosResponse } from 'axios';
import React ,{ useState } from 'react';
import { async } from 'rxjs';

async function invite() {
  // const [data,setData] = useState();
  const requestoptions = {
    method: "POST"
  };
    const response = `http://localhost:5001/api/students/:rollNo`;
    return fetch(response, requestoptions)
      .then((data) => {
        console.log("Category Details: ", data);
        return data;
      });
       
}


const profservice = {
    invite
}
export default profservice
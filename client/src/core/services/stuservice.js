async function studentID(rollno) {
  const requestoptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response1 = `http://localhost:5001/api/students/${rollno}`;
  return fetch(response1, requestoptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

}
const stuservice = {
  studentID
}
export default stuservice
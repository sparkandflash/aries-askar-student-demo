async function addStudent(student) {
  const requestoptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ student }),
  };
  const response1 = `http://localhost:5001/api/addStudents`;
  return fetch(response1, requestoptions)
    .then((response) => response.json())
    .then(data => {
      return data;
    });

}
const profservice = {
  addStudent
}
export default profservice
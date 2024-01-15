import { Attributes, message } from '@/studentData'
import { apiCall } from './BaseUrl'


export async function makeInvite() {
  try {
    const response = await apiCall.get(`/createInvite`);
    return response  //Should return invite url and out of band id
  } catch (error) {
    console.log('Invitation creation failed:', error);
    throw error; 
  }
}

export async function makeInvitationWMSG(attributeData:Attributes) {
  try {
    const response = await apiCall.post("/acceptCred", { attributeData })
    console.log(response.data)
    return response.data;
  } catch (error) {
    //console.log('Invitation creation failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function shortenUrl(longUrl: string): Promise<string | undefined> {

  try {
    const response = await apiCall.post('/shorten', { longUrl });
    return response.data.shortUrl;
  } catch (error) {
    console.error('Error shortening URL:', error);
  }
}

export async function clearData() {
  try {
    const response = await apiCall.get('/cleanup');
  } catch (error) {
    console.error('Error cleaning data:', error);
  }
}
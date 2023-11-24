import axios from 'axios'

const baseUrl = 'http://localhost:5001'
export const apiCall = axios.create({ baseURL: baseUrl })
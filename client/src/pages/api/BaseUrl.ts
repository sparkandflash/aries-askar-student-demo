import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL

export const apiCall = axios.create({ baseURL: baseUrl })
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
export default function useCustomAxios() {
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });
}
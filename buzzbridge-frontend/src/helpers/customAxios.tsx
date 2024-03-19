import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
const token = JSON.parse(localStorage.getItem("token") || "null");
export default function customAxios() {
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

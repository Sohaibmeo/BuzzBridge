import axios from "axios";
import { useUser } from "../components/Providers/UserProvider";

export default function useCustomAxios() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { token } = useUser();
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

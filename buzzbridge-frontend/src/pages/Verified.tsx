import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useCustomAxios from "../helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";

const Verified = () => {
    const { token } = useParams();
    const axiosInstance = useCustomAxios();
    const { showAlert } = useAlert();
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const request = await axiosInstance.post(
                    `/auth/verify/${token}`
                );
                if (request.status === 200) {
                    showAlert("success", "Email Verified");
                } else {
                    throw new Error(request.data);
                }
            } catch (error: any) {
                showAlert("error", error.message);
            }
        };
        verifyEmail();
    },[]);
  return (
    <div></div>
  )
}

export default Verified

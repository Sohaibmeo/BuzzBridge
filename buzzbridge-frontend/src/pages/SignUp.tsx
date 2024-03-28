import { Container, CardMedia, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomLoadingButton from "../components/Custom/CustomLoadingButton";
import useCustomAxios from "../utils/helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";
import SignUpForm from "../components/Forms/SignUpForm";
const SignUp = ({ forgetPassword = false }: { forgetPassword?: boolean }) => {
  const { token } = useParams();

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({});
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();

  const verifyAndSetUser = async (token: string) => {
    setLoadingData(true);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/auth/verify/${token}`);
      if (response.status !== 200) {
        throw new Error("Link Expired. Please try again.");
      }
      setUser(response.data);
      setSuccess(true);
      setLoading(false);
      setLoadingData(false);
      setSuccess(null);
    } catch (e: any) {
      setLoading(false);
      setSuccess(false);
      console.error(e);
      if (e.response.data.statusCode === 403) {
        navigate("/login");
        showAlert("error", "Link Expired. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token && !forgetPassword) {
      verifyAndSetUser(token);
    } else if (forgetPassword) {
      setLoadingData(false);
    }
    // eslint-disable-next-line
  }, [token]);
  return (
    <>
      <>
        <CardMedia
          component="img"
          image={"/5495.jpg"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              padding: "6%",
              backgroundColor: "white",
            }}
          >
            {loadingData ? (
              <CustomLoadingButton
                loading={loading}
                success={success}
                Icon={<LockIcon />}
              />
            ) : (
              <SignUpForm
                user={user}
                forgetPassword
                token={token ? token : ""}
              />
            )}
          </Box>
        </Container>
      </>
    </>
  );
};

export default SignUp;

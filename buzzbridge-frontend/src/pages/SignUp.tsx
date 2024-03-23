import {
  Container,
  CardMedia,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomLoadingButton from "../components/Custom/CustomLoadingButton";
import useCustomAxios from "../helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";
const SignUp = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { newPassword, confirmPassword } = formData;
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );
      console.log(response);
      if (response.status !== 201 && response.data.statusCode !== 201) {
        throw new Error("Password reset failed");
      }
      setSuccess(true);
      setLoading(false);
      navigate("/login");
      showAlert("success", "Password reset successfully. Set Up Your Profile.");
    } catch (e: any) {
      setSuccess(false);
      setLoading(false);
      console.error(e);
      showAlert("error", e.response.data.message);
    }
  };
  const verifyAndSetUser = async (token: string) => {
    setLoadingData(true);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/auth/verify/${token}`);
      if (response.status !== 200) {
        throw new Error("Link Expired. Please try again.");
      }
      console.log(response);
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
    if (token) {
      verifyAndSetUser(token);
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
                handleSubmit={() => {}}
                success={success}
                Icon={<LockIcon />}
              />
            ) : (
              <form
                style={{
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Typography
                  variant="h3"
                  color={"rgb(185, 43, 39)"}
                  textAlign={"center"}
                  mb={"10%"}
                >
                  BuzzBridge
                </Typography>
                <TextField disabled label="Email" value={user.email || ""} />
                <TextField
                  label="New Password"
                  required
                  type="password"
                  name="newPassword"
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  required
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
                <CustomLoadingButton
                  loading={loading}
                  success={success}
                  handleSubmit={handleSubmit}
                />
              </form>
            )}
          </Box>
        </Container>
      </>
    </>
  );
};

export default SignUp;

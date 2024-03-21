import {
  Container,
  CardMedia,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { extractJWTData } from "../helpers/extractJwtData";
import CustomLoadingButton from "../components/Custom/CustomLoadingButton";
import useCustomAxios from "../helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";
const SignUp = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { newPassword, confirmPassword } = formData;
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: newPassword,
      });
      setSuccess(true);
      setLoading(false);
      showAlert("success", "Password reset successfully. Set Up Your Profile.");
    } catch (e: any) {
      setSuccess(false);
      setLoading(false);
      console.error(e);
      showAlert("error", e.message);
    }
  };
  useEffect(() => {
    if (token) {
      try {
        const { exp, iat, ...rest } = extractJWTData(token);
        console.log("User : ", rest);
        setUser(rest);
      } catch (e) {
        console.error(e);
      }
    }
  }, [token]);
  return (
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
          <form style={{ flexDirection: "column", display: "flex", gap: 10 }}>
            <Typography
              variant="h3"
              color={"rgb(185, 43, 39)"}
              textAlign={"center"}
              mb={"10%"}
            >
              BuzzBridge
            </Typography>
            <TextField
              disabled
              label="Email"
              value={user.email || ""}
            />
            <TextField
              label="New Password"
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
              width={"100%"}
            />
          </form>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;

import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import useCustomAxios from "../../helpers/customAxios";
import { useAlert } from "../Providers/AlertProvider";
import { UserSignUp } from "../../types/UserTypes";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";

const CreateUserForm = ({
  setOpenModal,
  forgetPassword = false,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  forgetPassword?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const [formData, setFormData] = useState<UserSignUp>({
    email: "",
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const request = forgetPassword
        ? await axiosInstance.post("auth/forget-password-link", formData)
        : await axiosInstance.post("/auth/signup", formData);
      if (request.status === 201) {
        showAlert(
          "info",
          `Please procceed to your email to verify your account.`
        );
        setOpenModal(false);
        setSuccess(true);
        setIsLoading(false);
      } else {
        throw new Error(request.data);
      }
    } catch (error: any) {
      showAlert("error", error?.response?.data?.message);
      setSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        style={{
          marginTop: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {forgetPassword ? "Forgot Password" : "Sign Up"}
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                name="email"
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
          <CustomLoadingButton
            loading={isLoading}
            success={success}
            handleSubmit={handleSubmit}
            Icon={<ArrowForward />}
          />
        </form>
        <Grid container justifyContent="flex-end" style={{ marginTop: "16px" }}>
          <Grid item>
            {!forgetPassword && (
              <Button onClick={() => setOpenModal(false)}>
                Already have an account? Sign in
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateUserForm;

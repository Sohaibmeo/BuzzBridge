import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useAlert } from "../Providers/AlertProvider";
import { UserSignUp } from "../../types/UserTypes";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "../../utils/schema/userSchema";
import { useForm } from "react-hook-form";

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
  const handleData = async (e: any) => {
    setIsLoading(true);
    try {
      forgetPassword
        ? await axiosInstance.post("auth/forget-password-link", formData)
        : await axiosInstance.post("/auth/signup", formData);
      showAlert(
        "info",
        `Please procceed to your email to verify your account.`
      );
      setOpenModal(false);
      setSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      showAlert("error", error?.response?.data?.message);
      setSuccess(false);
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignUp>({
    resolver: zodResolver(EmailSchema),
  });

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
          onSubmit={handleSubmit(handleData)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item xs={10}>
              <TextField
                {...register("email")}
                helperText={errors.email?.message}
                error={Boolean(errors.email?.message)}
                variant="outlined"
                fullWidth
                label="Email Address"
                name="email"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={2} justifyContent={"center"} alignItems={"center"}>
              <CustomLoadingButton
                loading={isLoading}
                success={success}
                Icon={<ArrowForward />}
                marginBottom="16px"
              />
            </Grid>
          </Grid>
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

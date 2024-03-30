import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useNavigate } from "react-router-dom";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useAlert } from "../Providers/AlertProvider";
import { ResetPassword } from "../../types/UserTypes";
import { ChangePasswordSchema } from "../../utils/schema/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignUpForm = ({
  user,
  forgetPassword,
  token,
}: {
  user: any;
  forgetPassword: boolean;
  token: string;
}) => {
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const [formData, setFormData] = useState<ResetPassword>({
    newPassword: "",
    confirmPassword: "",
  });
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = async (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleData = async () => {
    setLoading(true);
    try {
      const { newPassword } = formData;
      const response = forgetPassword
        ? await axiosInstance.post(`/auth/reset-password-link/${token}`, {
            password: newPassword,
          })
        : await axiosInstance.post(`/auth/reset-password/${token}`, {
            password: newPassword,
          });
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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const displaySmallScreen = useMediaQuery("(max-width:800px)");
  return (
    <form
      onSubmit={handleSubmit(handleData)}
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
      {!forgetPassword && (
        <TextField disabled fullWidth label="Email" value={user.email || ""} />
      )}
      <FormControl sx={{ width: "300px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">
          New Password
        </InputLabel>
        <OutlinedInput
          {...register("newPassword")}
          fullWidth
          name="newPassword"
          label="New Password"
          onBlur={handleChange}
          error={Boolean(errors.newPassword?.message)}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText error id="username-error">
          {errors.newPassword?.message}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ width: "300px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">
          New Password
        </InputLabel>
        <OutlinedInput
          fullWidth
          {...register("confirmPassword")}
          name="confirmPassword"
          label="Confirm Password"
          onBlur={handleChange}
          error={Boolean(errors.confirmPassword?.message)}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText error id="username-error">
          {errors.confirmPassword?.message}
        </FormHelperText>
      </FormControl>
      <CustomLoadingButton
        loading={displaySmallScreen ? false : loading}
        success={displaySmallScreen ? null : success}
      />
    </form>
  );
};

export default SignUpForm;

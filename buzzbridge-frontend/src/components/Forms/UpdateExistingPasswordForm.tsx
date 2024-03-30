import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import useCustomAxios from "../../utils/helpers/customAxios";
import { ResetPassword } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import { useUser } from "../Providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "../../utils/schema/userSchema";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UpdateExistingPasswordForm = () => {
  const [formData, setFormData] = useState<ResetPassword>({
    newPassword: "",
    confirmPassword: "",
  });
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async () => {
    try {
      const { confirmPassword, ...data } = formData;
      await axiosInstance.patch(`/auth/account-password-change`, {
        ...data,
      });
      showAlert("success", "Password updated");
    } catch (error: any) {
      showAlert("error", error.response.data.message);
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: zodResolver(ChangePasswordSchema),
  });
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 10,
        width: "fit-content",
      }}
    >
      <FormControl sx={{ width: "300px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">
          Old Password
        </InputLabel>
        <OutlinedInput
          fullWidth
          {...register("password", { required: true })}
          name="password"
          label="Old Password"
          onBlur={handleChange}
          error={Boolean(errors.password?.message)}
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
          {errors.password?.message}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ width: "300px" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
        <OutlinedInput
          fullWidth
          {...register("newPassword")}
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
        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
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
      <Button type="submit" variant="contained" color="inherit">
        Update
      </Button>
    </form>
  );
};

export default UpdateExistingPasswordForm;

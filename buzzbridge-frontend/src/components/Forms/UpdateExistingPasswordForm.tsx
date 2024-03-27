import { Button, Typography } from "@mui/material";
import { useState } from "react";
import useCustomAxios from "../../helpers/customAxios";
import { ResetPassword } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import { useUser } from "../Providers/UserProvider";
import CustomPasswordInputField from "../Custom/CustomPasswordInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "../utils/schema/userSchema";
import { useForm } from "react-hook-form";

const UpdateExistingPasswordForm = () => {
  const [formData, setFormData] = useState<ResetPassword>({
    newPassword: "",
    confirmPassword: "",
  });
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();

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
      console.log(error)
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
      <Typography variant="h5" color={"inherit"} textAlign={"center"}>
        Update Password
      </Typography>
      <CustomPasswordInputField
        config={register("password", { required: true })}
        name="password"
        label="Old Password"
        onBlur={handleChange}
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
      />
      <CustomPasswordInputField
        config={register("newPassword", { required: true })}
        name="newPassword"
        label="New Password"
        onBlur={handleChange}
        error={Boolean(errors.newPassword?.message)}
        helperText={errors.newPassword?.message}
      />
      <CustomPasswordInputField
        config={register("confirmPassword", { required: true })}
        name="confirmPassword"
        label="Confirm Password"
        onBlur={handleChange}
        error={Boolean(errors.confirmPassword?.message)}
        helperText={errors.confirmPassword?.message}
      />
      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
};

export default UpdateExistingPasswordForm;

import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { User, UserChangeEmail } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../helpers/customAxios";
import { useUser } from "../Providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEmailSchema } from "../utils/schema/userSchema";
import { useForm } from "react-hook-form";

const UpdateExistingEmailForm = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState<UserChangeEmail>({
    email: "",
    confirmEmail: "",
  });
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async () => {
    try {
      await axiosInstance.patch(`/user/${user?.id}`, {
        email: formData.email,
      });
      showAlert("success", "Succesfully Updated Email")
      expireCurrentUserSession();
    } catch (error: any) {
      if (error?.response?.data?.statusCode === 401) {
        showAlert("error", "Unauthorized Request made");
        expireCurrentUserSession();
      } else if (error.response && error.response.data) {
        showAlert("error", error.response.data.message);
      } else {
        showAlert("error", error);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserChangeEmail>({
    resolver: zodResolver(ChangeEmailSchema),
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
        Update Email
      </Typography>
      <TextField
        {...register("email")}
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        label="Email"
        name="email"
        defaultValue={user?.email}
        onBlur={handleChange}
      />
      {formData?.email && (
        <TextField
          {...register("confirmEmail")}
          error={Boolean(errors.confirmEmail?.message)}
          helperText={errors.confirmEmail?.message}
          label="Confirm Email"
          type="email"
          name="confirmEmail"
          onBlur={handleChange}
        />
      )}
      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
};

export default UpdateExistingEmailForm;

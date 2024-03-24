import { TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import CustomPasswordInputField from "../Custom/CustomPasswordInputField";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useNavigate } from "react-router-dom";
import useCustomAxios from "../../helpers/customAxios";
import { useAlert } from "../Providers/AlertProvider";

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
  const [formData, setFormData] = useState<any>({});
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = async (e: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const validateFormData = () => {
    const { newPassword, confirmPassword } = formData;
    if (!newPassword || !confirmPassword) {
      showAlert("error", "All fields are required");
      return false;
    }
    if (newPassword.length < 8) {
      showAlert("error", "Password must be at least 8 characters long");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!validateFormData()) return;
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
  const displaySmallScreen = useMediaQuery("(max-width:800px)");
  return (
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
      {!forgetPassword && (
        <TextField disabled label="Email" value={user.email || ""} />
      )}
      <CustomPasswordInputField
        setFormData={setFormData}
        name="newPassword"
        label="New Password"
        onBlur={handleChange}
      />
      <CustomPasswordInputField
        setFormData={setFormData}
        name="confirmPassword"
        label="Confirm Password"
        onBlur={handleChange}
      />
      <CustomLoadingButton
        loading={displaySmallScreen ? false : loading}
        success={displaySmallScreen ? null : success}
        handleSubmit={handleSubmit}
      />
    </form>
  );
};

export default SignUpForm;

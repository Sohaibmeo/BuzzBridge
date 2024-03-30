import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/AlertProvider";
import { LoginUser } from "../../types/UserTypes";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useUser } from "../Providers/UserProvider";
import CreateModal from "../Modals/CreateModal";
import CreateUserForm from "./CreateUserForm";
import LoginWithGoogleOrFacebook from "./LoginWithGoogleOrFacebook";
import CustomPasswordInputField from "../Custom/CustomPasswordInputField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginUserForm = ({
  isModal = false,
  setOpenModal,
}: {
  isModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showAlert } = useAlert();
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { handleCurrentUserLogin } = useUser();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const [formData, setFormData] = useState<LoginUser>({
    username: "",
    password: "",
  });
  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data.jwt && response.data.data) {
        showAlert("success", "Login Sucesful");
        handleCurrentUserLogin(response.data);
        if (isModal && setOpenModal) {
          setOpenModal(false);
        } else {
          navigate("/");
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      showAlert("error", error.message);
    }
  };
  return (
    <form style={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Email"
            name="username"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomPasswordInputField
            name="password"
            label="Password"
            onChange={handleChange}
            width={"100%"}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "16px" }}
        onClick={handleSubmit}
      >
        Login
      </Button>
      <Box display={"flex"} justifyContent="space-between" flexWrap={"wrap"}>
        <Button
          color="primary"
          style={{ marginTop: "16px" }}
          onClick={() => setOpenSignUpModal(true)}
        >
          Sign Up?
        </Button>
        <Button
          color="primary"
          style={{ marginTop: "16px" }}
          onClick={() => setOpenForgetPasswordModal(true)}
        >
          Forgot Password?
        </Button>
      </Box>
      {/* <Button
        color="primary"
        style={{ marginTop: '16px' }}
        onClick={() => setOpenLoginModal(true)}
      >
        Continue with Google
      </Button> */}
      {openSignUpModal && (
        <CreateModal
          openModal={openSignUpModal}
          setOpenModal={setOpenSignUpModal}
          width={410}
          Children={<CreateUserForm setOpenModal={setOpenSignUpModal} />}
        />
      )}
      {openLoginModal && (
        <CreateModal
          openModal={openLoginModal}
          setOpenModal={setOpenLoginModal}
          width={410}
          Children={
            <LoginWithGoogleOrFacebook setOpenModal={setOpenLoginModal} />
          }
        />
      )}
      {openForgetPasswordModal && (
        <CreateModal
          openModal={openForgetPasswordModal}
          setOpenModal={setOpenForgetPasswordModal}
          width={410}
          Children={
            <CreateUserForm
              setOpenModal={setOpenForgetPasswordModal}
              forgetPassword
            />
          }
        />
      )}
    </form>
  );
};

export default LoginUserForm;

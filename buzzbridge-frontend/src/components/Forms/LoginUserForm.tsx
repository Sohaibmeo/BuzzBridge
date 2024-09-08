import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  const { handleCurrentUserLogin } = useUser();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data.jwt) {
        showAlert("success", "Login Sucesful");
        handleCurrentUserLogin(response.data);
        if (isModal && setOpenModal) {
          setOpenModal(false);
        } else {
          navigate("/");
        }
      } else {
        throw new Error(response.data);
      }
    } catch (error: any) {
      showAlert("error", error.message);
    }
    setLoading(false);
  };
  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const response = await axiosInstance.get("/auth/google/login");
      const googleAuthUrl = response.data.url;
      localStorage.removeItem("token");
      window.location.href = googleAuthUrl;
    } catch (error: any) {
      setLoadingGoogle(false);
      showAlert("error", error.message || "Error Logging in with Google");
    }
  };
  return (
    <form style={{ width: "80%", margin: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} mt={isModal ? "10%" : ""}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            disabled={loading || loadingGoogle}
            startIcon={!loadingGoogle && <GoogleIcon />}
            onClick={handleGoogleLogin}
          >
            {loadingGoogle ? (
              <CircularProgress size={'22px'} />
            ) : (
              "Login With Google"
            )}
          </Button>
        </Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        {!isModal && (
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Typography variant="body1" gutterBottom>
              Test Account :
              email : sohaibmayo12@gmail.com
              password: Test@123
            </Typography>
          </Grid>
        )}
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
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              name="password"
              label="Password"
              onChange={handleChange}
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
          </FormControl>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || loadingGoogle}
        color="primary"
        style={{ marginTop: "16px" }}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress size={'22px'}/> : "Login"}
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
      {openSignUpModal && (
        <CreateModal
          openModal={openSignUpModal}
          setOpenModal={setOpenSignUpModal}
          width={410}
          Children={<CreateUserForm setOpenModal={setOpenSignUpModal} />}
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

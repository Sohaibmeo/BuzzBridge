import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Providers/AlertProvider';
import { LoginUser } from '../../types/UserTypes';
import useCustomAxios from '../../helpers/customAxios';
import { useUser } from '../Providers/UserProvider';
import CreateModal from '../Modals/CreateModal';
import CreateUserForm from './CreateUserForm';
import LoginWithGoogleOrFacebook from './LoginWithGoogleOrFacebook';

const LoginUserForm = ({
  isModal = false,
  setOpenModal,
}: {
  isModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showAlert } = useAlert();
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { handleCurrentUserLogin } = useUser();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const [formData, setFormData] = useState<LoginUser>({
    username: '',
    password: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      if (response.data.jwt && response.data.data) {
        showAlert('success', 'Login Sucesful');
        handleCurrentUserLogin(response.data);
        if (isModal && setOpenModal) {
          setOpenModal(false);
        } else {
          navigate('/');
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} display={'flex'} justifyContent={'center'}>
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
      >
        Login
      </Button>
      <Button
        color="primary"
        style={{ marginTop: '16px' }}
        onClick={() => setOpenSignUpModal(true)}
      >
        Sign Up?
      </Button>
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
    </form>
  );
};

export default LoginUserForm;

import { Button, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Providers/AlertProvider';
import { useCookies } from 'react-cookie';
import { LoginUser } from '../../types/UserTypes';
import customAxios from '../../helpers/customAxios';

const LoginUserForm = () => {
  const [cookie, setCookies] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = customAxios();
  const [formData, setFormData] = useState<LoginUser>({
    username: '',
    password: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const request = await axiosInstance.post('/auth/login', formData);
      if (request.status === 201) {
        showAlert('success', 'Login Sucesful');
        if (!cookie.jwt) {
          setCookies('jwt', request.data);
          navigate('/');
        }
      } else {
        showAlert('error', 'Invalid Credentials');
      }
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Username"
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
    </form>
  );
};

export default LoginUserForm;

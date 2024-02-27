import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../components/Providers/AlertProvider';
import { useCookies } from 'react-cookie';
import { LoginUser } from '../types/UserTypes';
import useCustomAxios from '../helpers/customAxios';

const Login = () => {
  const [cookie, setCookies] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
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
    <Container maxWidth="xs">
      <div
        style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
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
        <Grid container justifyContent="flex-end" style={{ marginTop: '16px' }}>
          <Grid item>
            <Link href="/signup" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Login;

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
import { CreateUser } from '../types/UserTypes';
import customAxios from '../helpers/customAxios';

const SignUp = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const axiosInstance = customAxios();
  const [formData, setFormData] = useState<CreateUser>({
    name: '',
    username: '',
    password: '',
    age: 0,
    gender: 'Male',
    email: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const request = await axiosInstance.post('/user/', formData);
      if (request.data === 'Succesful') {
        showAlert('info', 'Use your credentials to log in now');
        navigate('/login');
      } else {
        showAlert('error', request.data);
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
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Full Name"
                name="name"
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
            <Grid item xs={6}>
              <TextField
                id="outlined-number"
                label="Age"
                name="age"
                type="number"
                required
                fullWidth
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: parseInt(e.target.value, 10),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Gender"
                name="gender"
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
                label="Email Address"
                name="email"
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
            Sign Up
          </Button>
        </form>
        <Grid container justifyContent="flex-end" style={{ marginTop: '16px' }}>
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default SignUp;

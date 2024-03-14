import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../helpers/customAxios';
import { useAlert } from '../Providers/AlertProvider';
import { CreateUser } from '../../types/UserTypes';

const CreateUserForm = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const axiosInstance = customAxios();
  const [formData, setFormData] = useState<CreateUser>({
    name: '',
    username: '',
    password: '',
    email: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const request = await axiosInstance.post(
        '/email/register-user',
        formData,
      );
      if (request.data?.email) {
        showAlert(
          'info',
          `username and password sent to ${request.data.email}`,
        );
        navigate('/login');
      } else {
        throw new Error(request.data);
      }
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
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
            <Button onClick={() => setOpenModal(false)}>
              Already have an account? Sign in
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateUserForm;

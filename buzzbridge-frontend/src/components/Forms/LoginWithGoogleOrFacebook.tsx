import {
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Box,
  } from '@mui/material';
  import { useState } from 'react';
  import useCustomAxios from '../../utils/helpers/customAxios';
  import { useAlert } from '../Providers/AlertProvider';
  import { CreateUser } from '../../types/UserTypes';
  import CustomLoadingButton from '../Custom/CustomLoadingButton';
  import ArrowForward from '@mui/icons-material/ArrowForward';
  
  const LoginWithGoogleOrFacebook = ({
    setOpenModal,
  }: {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const { showAlert } = useAlert();
    const axiosInstance = useCustomAxios();
    const [formData, setFormData] = useState<CreateUser>({
      name: '',
      username: '',
      password: '',
      email: '',
    });
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const request = await axiosInstance.post(
          '/email/register-user',
          formData,
        );
        if (request.data?.email) {
          showAlert(
            'info',
            `please proceed to your email to verify your account.`,
          );
          setOpenModal(false);
          setSuccess(true);
          setIsLoading(false);
        } else {
          throw new Error(request.data);
        }
      } catch (error: any) {
        console.error(error);
        showAlert('error', error.message);
        setSuccess(false);
        setIsLoading(false);
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
            Google Or Facebook
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
            <CustomLoadingButton
              loading={isLoading}
              success={success}
              Icon={<ArrowForward />}
            />
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
  
  export default LoginWithGoogleOrFacebook;
  
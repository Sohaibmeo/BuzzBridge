import {
  Container,
  Grid,
  Typography,
  Link,
} from '@mui/material';
import LoginUserForm from '../components/Forms/LoginUserForm';

const Login = () => {
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
        <LoginUserForm />
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

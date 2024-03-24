import {
  Container,
  Box,
  CardMedia,
} from '@mui/material';
import LoginUserForm from '../components/Forms/LoginUserForm';

const Login = () => {
  return (
    <>
    <CardMedia
        component="img"
        image={'5495.jpg'}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 'fit-content',
            height: 'fit-content',
            padding: '5%',
            backgroundColor: 'white',
          }}
        >
          <LoginUserForm />
        </Box>
      </Container>
    </>
  );
};

export default Login;

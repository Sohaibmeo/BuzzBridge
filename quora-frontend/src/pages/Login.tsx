import {
  Container,
  Grid,
  Button,
  Box,
  CardMedia,
} from '@mui/material';
import LoginUserForm from '../components/Forms/LoginUserForm';
import { useState } from 'react';
import CreateModal from '../components/Modals/CreateModal';
import CreateUserForm from '../components/Forms/CreateUserForm';

const Login = () => {
  const [openSignupModal, setOpenSignupModal] = useState(false);
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
          <Grid
            container
            justifyContent="flex-end"
            style={{ marginTop: '16px' }}
          >
            <Grid item>
              <Button color="inherit" onClick={() => setOpenSignupModal(true)}>
                Sign up
              </Button>
            </Grid>
          </Grid>
        </Box>
        {openSignupModal && (
          <CreateModal
            openModal={openSignupModal}
            setOpenModal={setOpenSignupModal}
            width={410}
            Children={<CreateUserForm setOpenModal={setOpenSignupModal} />}
          />
        )}
      </Container>
    </>
  );
};

export default Login;

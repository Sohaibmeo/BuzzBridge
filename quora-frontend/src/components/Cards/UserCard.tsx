import React from 'react';
import { User } from '../../types/UserTypes';
import { Box, Button, CardContent, CardMedia, Typography } from '@mui/material';
import CreateModal from '../Modals/CreateModal';
import useJwtExtractId from '../../helpers/jwtExtracId';

const UserCard = ({ user }: { user: User | null }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const picture = user?.picture || process.env.PUBLIC_URL + '/user_avatar.png';
  const currentUser = useJwtExtractId();
  return (
    <CardContent sx={{ backgroundColor: 'transparent', marginBottom: '2%' }}>
      <Box sx={{ display: 'flex' }}>
        {picture ? (
          <CardMedia
            component="img"
            src={picture.toString()}
            alt={process.env.PUBLIC_URL + '/user_avatar.png'}
            sx={{ width: '150px', height: '150px', borderRadius: '50%' }}
            onClick={() => {
              setOpenModal(true);
            }}
          />
        ) : null}
        <Box sx={{ ml: '3%', position: 'relative' }}>
          <Typography
            variant="h4"
            fontWeight={'bolder'}
            textTransform={'capitalize'}
          >
            {user?.name}
          </Typography>
          <Typography variant="body2">{user?.email}</Typography>
          {user && currentUser === user.id && (
            <Button variant="contained" color="primary">
              Edit
            </Button>
          )}
        </Box>
      </Box>
      <Typography
        fontFamily={'cursive'}
        fontStyle={'italic'}
        sx={{ mt: '10%' }}
      >
        {user?.about
          ? '"' + user?.about + '"'
          : '"You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet."'}
      </Typography>
      {openModal && (
        <CreateModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          image={true}
          Children={
            <CardMedia
              component="img"
              src={picture.toString()}
              alt={'User Avatar'}
              style={{ width: '100%', height: '100%' }}
            />
          }
        />
      )}
    </CardContent>
  );
};

export default UserCard;

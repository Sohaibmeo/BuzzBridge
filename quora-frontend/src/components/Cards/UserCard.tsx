import React from 'react';
import { User } from '../../types/UserTypes';
import { Box, CardContent, Typography } from '@mui/material';
import CreateModal from '../Modals/CreateModal';

const UserCard = ({ user }: { user: User }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const picture = user.picture || '';
  return (
    <CardContent sx={{ backgroundColor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          {user.picture ? (
            <img
              src={picture.toString()}
              alt={'User '}
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              onClick={() => {
                console.log(openModal);
                setOpenModal(true);
              }}
            />
          ) : null}
        </Typography>
        <Typography>{user.name}</Typography>
        <Typography>{user.email}</Typography>
      </Box>
      {openModal && (
        <CreateModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          image={true}
          Children={
            <img
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

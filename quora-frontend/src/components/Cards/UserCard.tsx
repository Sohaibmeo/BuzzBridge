import React, { useState } from 'react';
import { User } from '../../types/UserTypes';
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import CreateModal from '../Modals/CreateModal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import useJwtExtractId from '../../helpers/jwtExtracId';
import UpdateUserForm from '../Forms/UpdateUserForm';

const UserCard = ({
  user,
  hover,
  width,
  height,
}: {
  user: User | null;
  hover?: boolean;
  width?: string | number;
  height?: string | number;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
  const picture = user?.picture || process.env.PUBLIC_URL + '/user_avatar.png';
  const currentUser = useJwtExtractId();
  return (
    <CardContent
      sx={{
        backgroundColor: 'transparent',
        marginBottom: '2%',
        height: { height },
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          width: hover ? { width } : '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ ml: '3%', position: 'relative' }}>
            <Typography
              variant="h4"
              fontWeight={'bolder'}
              textTransform={'capitalize'}
            >
              {user?.name}
            </Typography>
            <Typography variant="body2">{user?.email}</Typography>
            {user && !hover && currentUser === user.id && (
              <Button
                variant="contained"
                color="inherit"
                sx={{ mt: '5%' }}
                onClick={() => setOpenUpdateProfileModal(true)}
              >
                Edit
                <EditOutlinedIcon />
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            fontFamily={'cursive'}
            fontStyle={'italic'}
            sx={{ mt: '10%' }}
          >
            {user?.about
              ? '"' + user?.about + '"'
              : '"You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet."'}
          </Typography>
        </Grid>
      </Grid>
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
      {openUpdateProfileModal && (
        <CreateModal
          openModal={openUpdateProfileModal}
          setOpenModal={setOpenUpdateProfileModal}
          Children={
            <UpdateUserForm
              user={user}
              setOpenModal={setOpenUpdateProfileModal}
            />
          }
        />
      )}
    </CardContent>
  );
};

export default UserCard;

import React, { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import UserCard from '../components/Cards/UserCard';

const About = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`http://localhost:3000/user/${id}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [id]);
  return (
    <div>
      {user ? (
        <>
          <Grid
            container
            columnGap={2}
            justifyContent={'center'}
            sx={{ mt: '2%' }}
          >
            <Grid
              item
              xs={1}
              sx={{
                position: 'sticky',
                top: '10%',
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'end',
                borderRadius: '3px',
              }}
            >
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon />
              </Button>
            </Grid>
            <Grid item xs={4.5}>
              <UserCard user={user} />
            </Grid>
            <Grid item xs={3.5}>
              <AdvertisementCard />
            </Grid>
          </Grid>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default About;

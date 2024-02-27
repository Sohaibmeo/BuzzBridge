import { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import useJwtExtractId from '../helpers/jwtExtracId';
import UserCard from '../components/Cards/UserCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../helpers/customAxios';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [questions, setQuestions] = useState([]);
  // const [answers, setAnswers] = useState([]);
  // const [following, setFollowing] = useState([]);
  const axiosInstance = useCustomAxios();
  const currentUser = useJwtExtractId();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topics');
  const handleLoadData = (tab: string) => {
    setCurrentTab(tab);
    try {
      // const response = axiosInstance.get(
      //   `/user/${currentUser}/${tab}`,
      // );
    } catch (error) {
      console.log(error);
    }
  };
  const switchTabContent = ['question', 'answer', 'following'];
  useEffect(() => {
    async function fetchUser() {
      const response = await axiosInstance.get(`/user/${currentUser}`);
      setUser(response.data);
    }
    currentUser && fetchUser();
    // eslint-disable-next-line
  }, [currentUser]);
  return (
    <Grid container justifyContent={'center'}>
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
      <Grid item xs={3.5}>
        <UserCard user={user} />
        <Box
          sx={{
            display: 'flex',
            marginTop: '20px',
          }}
        >
          {switchTabContent.map((tab, index) => (
            <Button
              key={index}
              variant="text"
              color="inherit"
              sx={{
                border: '0 0 2px 0 soild red',
              }}
              onClick={() => handleLoadData(tab)}
            >
              <Typography
                variant="body2"
                color="text.error"
                position={'relative'}
                textTransform={'capitalize'}
                sx={{
                  '::after': {
                    content: '""',
                    display: currentTab === tab ? 'block' : 'none',
                    position: 'absolute',
                    width: '100%',
                    height: '0.175rem',
                    bottom: '-0.175rem',
                    left: 0,
                    backgroundColor: 'red',
                  },
                }}
              >
                {tab}
              </Typography>
            </Button>
          ))}
        </Box>
      </Grid>
      <Grid item xs={2.5}>
        <UserCard user={user} />
      </Grid>
    </Grid>
  );
};

export default Profile;

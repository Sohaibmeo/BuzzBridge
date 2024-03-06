import { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import UserCard from '../components/Cards/UserCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomAxios from '../helpers/customAxios';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import PaginatedCards from '../components/Cards/PaginatedCards';
import { useAlert } from '../components/Providers/AlertProvider';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [usersPageCount, setUserPageCount] = useState<any>({
    questionPageCount: 1,
    answerPageCount: 1,
    topicPageCount: 1,
    followingPageCount: 1,
  });
  const axiosInstance = useCustomAxios();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topics');
  const { id } = useParams();
  const handleLoadData = async (
    tab: string,
    limit: number,
    buttonCall: boolean,
  ) => {
    setCurrentTab(tab);
    try {
      const page = usersPageCount[`${tab}PageCount`] || 1;
      if (page > 1 && buttonCall) return;
      const URL =
        tab === 'following'
          ? `topic/user/${id}/following?page=${page}&limit=${limit}`
          : `${tab}/user/${id}?page=${page}&limit=${limit}`;
      const response = await axiosInstance.get(URL);
      switch (tab) {
        case 'question':
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setQuestions((prev) => prev.concat(response.data));
          break;
        case 'answer':
          console.log(response.data);
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setAnswers((prev) => prev.concat(response.data));
          break;
        case 'topic':
          console.log(response.data);
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setTopics((prev) => prev.concat(response.data));
          break;
        case 'following':
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setFollowings((prev) => prev.concat(response.data));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentTabData = () => {
    switch (currentTab) {
      case 'question':
        return questions;
      case 'answer':
        return answers;
      case 'topic':
        return topics;
      case 'following':
        return followings;
      default:
        return [];
    }
  };
  const switchTabContent = ['question', 'answer', 'topic', 'following'];
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosInstance.get(`/user/${id}`);
        setUser(response.data);
        handleLoadData('question', 4, false);
      } catch (error) {
        navigate('/');
        showAlert('error', 'User not found');
      }
    }
    fetchUser();
    setCurrentTab('question');
    // eslint-disable-next-line
  }, [id]);

  useEffect(
    () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          handleLoadData(currentTab, 4, false);
        }
      };
    },
    // eslint-disable-next-line
    [
      usersPageCount.questionPageCount,
      usersPageCount.answerPageCount,
      usersPageCount.topicPageCount,
      usersPageCount.followingPageCount,
    ],
  );

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
          {switchTabContent.map((tab: string, index) => (
            <Button
              key={index}
              variant="text"
              color="inherit"
              sx={{
                border: '0 0 2px 0 soild red',
              }}
              onClick={() => handleLoadData(tab, 4, true)}
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
                {tab + 's'}
              </Typography>
            </Button>
          ))}
        </Box>
        <PaginatedCards currentTab={currentTab} data={getCurrentTabData()} />
      </Grid>
      <Grid item xs={2.5}>
        <AdvertisementCard />
      </Grid>
    </Grid>
  );
};

export default Profile;

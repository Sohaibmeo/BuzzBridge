import { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import UserCard from '../components/Cards/UserCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomAxios from '../helpers/customAxios';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import PaginatedCards from '../components/Cards/PaginatedCards';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [usersPageCount, setUserPageCount] = useState<any>({
    questionPageCount: 1,
    answerPageCount: 1,
    topicPageCount: 1,
  });
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topics');
  const { id } = useParams();
  const handleLoadData = async (tab: string, limit: number) => {
    setCurrentTab(tab);
    try {
      const page = usersPageCount[`${tab}PageCount`] || 1;
      const response = await axiosInstance.get(
        `${tab}/user/${id}?page=${page}&limit=${limit}`,
      );
      console.log(page);
      switch (tab) {
        case 'question':
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setQuestions((prev) => prev.concat(response.data));
          break;
        case 'answer':
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setAnswers((prev) => prev.concat(response.data));
          break;
        case 'topic':
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setTopics((prev) => prev.concat(response.data));
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
      default:
        return [];
    }
  };
  const switchTabContent = ['question', 'answer', 'topic'];
  useEffect(() => {
    async function fetchUser() {
      const response = await axiosInstance.get(`/user/${id}`);
      setUser(response.data);
      handleLoadData('question', 2);
    }
    setCurrentTab('question');
    id && fetchUser();
    // eslint-disable-next-line
  }, [id]);
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
              onClick={() => handleLoadData(tab, 2)}
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
                {tab === 'topic' ? 'followings' : tab + 's'}
              </Typography>
            </Button>
          ))}
        </Box>
        <PaginatedCards
          currentTab={currentTab}
          data={getCurrentTabData()}
          handleLoadData={handleLoadData}
        />
      </Grid>
      <Grid item xs={2.5}>
        <AdvertisementCard />
      </Grid>
    </Grid>
  );
};

export default Profile;

import { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import UserCard from '../components/Cards/UserCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomAxios from '../helpers/customAxios';
import QuestionCard from '../components/Cards/QuestionCard';
import AnswerCard from '../components/Cards/AnswerCard';
import TopicCard from '../components/Cards/TopicCard';
import { QuestionType } from '../types/QuestionTypes';
import { TopicTypes } from '../types/TopicTypes';
import { AnswerTypes } from '../types/AnswerTypes';
import AdvertisementCard from '../components/Cards/AdvertisementCard';

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
  const handleLoadData = async (tab: string) => {
    setCurrentTab(tab);
    try {
      const limit = 2;
      const page = usersPageCount[`${tab}PageCount`] || 1;
      const response = await axiosInstance.get(
        `${tab}/user/${id}?page=${page}&limit=${limit}`,
      );
      console.log(page);
      switch (tab) {
        case 'question':
          usersPageCount.questionPageCount += 1;
          setQuestions((prev) => prev.concat(response.data));
          break;
        case 'answer':
          usersPageCount.answerPageCount += 1;
          setAnswers((prev) => prev.concat(response.data));
          break;
        case 'topic':
          usersPageCount.topicPageCount += 1;
          setTopics((prev) => prev.concat(response.data));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const switchTabContent = ['question', 'answer', 'topic'];
  useEffect(() => {
    async function fetchUser() {
      const response = await axiosInstance.get(`/user/${id}`);
      setUser(response.data);
      handleLoadData('question');
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
                {tab === 'topic' ? 'followings' : tab + 's'}
              </Typography>
            </Button>
          ))}
        </Box>
        {currentTab === 'question' && questions.length > 0 && (
          <Box>
            {questions.map((question: QuestionType, index: number) => (
              <QuestionCard key={index} question={question} />
            ))}
            <Button
              variant="text"
              color="inherit"
              onClick={() => handleLoadData(currentTab)}
            >
              Load More
            </Button>
          </Box>
        )}
        {currentTab === 'topic' && topics.length > 0 && (
          <Box>
            {topics.map((topic: TopicTypes, index: number) => (
              <TopicCard
                key={index}
                topic={topic}
                enlarge
                backgroundColor={'white'}
              />
            ))}
            <Button
              variant="text"
              color="inherit"
              onClick={() => handleLoadData(currentTab)}
            >
              Load More
            </Button>
          </Box>
        )}
        {currentTab === 'answer' && answers.length > 0 && (
          <Box>
            {answers.map((answer: AnswerTypes, index: number) => (
              <AnswerCard key={index} answer={answer} />
            ))}
            <Button
              variant="text"
              color="inherit"
              onClick={() => handleLoadData(currentTab)}
            >
              Load More
            </Button>
          </Box>
        )}
      </Grid>
      <Grid item xs={2.5}>
        <AdvertisementCard />
      </Grid>
    </Grid>
  );
};

export default Profile;

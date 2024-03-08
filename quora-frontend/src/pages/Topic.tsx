import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopicTypes } from '../types/TopicTypes';
import QuestionCard from '../components/Cards/QuestionCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import TopicCard from '../components/Cards/TopicCard';
import useCustomAxios from '../helpers/customAxios';
import { useAlert } from '../components/Providers/AlertProvider';
import EmptyContentCard from '../components/Cards/EmptyContentCard';

const Topic = () => {
  const [topic, setTopic] = useState<TopicTypes>({
    id: 0,
    title: '',
    description: '',
    picture: new URL('https://www.google.com/'),
  });
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState<number>(1);
  const { showAlert } = useAlert();
  let { id } = useParams();
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  async function getTopic() {
    try {
      const response = await axiosInstance.get(`/topic/${id}`);
      setTopic(response.data);
    } catch (error) {
      navigate('/');
      showAlert('error', 'Topic not found');
    }
  }
  async function getQuestions() {
    try {
      const response = await axiosInstance.get(
        `question/topic/${id}?page=${page}&limit=5`,
      );
      setQuestions((prev: any) => prev.concat(response.data));
      setPage((prev) => prev + 1);
    } catch (error) {
      showAlert('error', 'Error while fetching questions');
    }
  }
  useEffect(() => {
    if (id) {
      getTopic();
      getQuestions();
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(
    () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          getQuestions();
        }
      };
    },
    // eslint-disable-next-line
    [page],
  );

  return (
    <>
      <Grid container columnGap={2} justifyContent={'center'} sx={{ mt: '2%' }}>
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
        <Grid item xs={4.5} rowSpacing={5}>
          <TopicCard topic={topic} backgroundColor="white" enlarge />
          {questions.length > 0 ? (
            questions.map((question: any) => {
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  displayAnswers
                  postAnswer
                />
              );
            })
          ) : (
            <EmptyContentCard type="question" />
          )}
        </Grid>
        <Grid item xs={3.5}>
          <AdvertisementCard />
        </Grid>
      </Grid>
    </>
  );
};

export default Topic;

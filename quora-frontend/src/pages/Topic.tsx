import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CardContent, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopicTypes } from '../types/TopicTypes';
import QuestionCard from '../components/Cards/QuestionCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import TopicCard from '../components/Cards/TopicCard';
import useCustomAxios from '../helpers/customAxios';
import { useAlert } from '../components/Providers/AlertProvider';

const Topic = () => {
  const [topic, setTopic] = useState<TopicTypes>({
    id: 0,
    title: '',
    description: '',
    picture: new URL('https://www.google.com/'),
  });
  const {showAlert} = useAlert()
  let { id } = useParams();
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  useEffect(() => {
    async function getQuestionId() {
      try {
        const response = await axiosInstance.get(`/topic/${id}`);
        setTopic(response.data);
      } catch (error) {
        navigate('/');
        showAlert('error', 'Topic not found');
      }
    }
    id && getQuestionId();
    // eslint-disable-next-line
  }, [id]);
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
          {topic.questions?.length ? (
            topic.questions.map((question: any) => {
              return <QuestionCard key={question.id} question={question} />;
            })
          ) : (
            <CardContent sx={{ mb: '2%', backgroundColor: 'white' }}>
              <Typography variant="h5" component="div">
                Currently No Questions
              </Typography>
            </CardContent>
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

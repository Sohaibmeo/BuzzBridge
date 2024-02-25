import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CardContent, Grid, ListItem, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopicTypes } from '../types/TopicTypes';
import QuestionCard from '../components/Cards/QuestionCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';

const Topic = () => {
  const [topic, setTopic] = useState<TopicTypes>({
    id: 0,
    title: '',
    description: '',
    picture: new URL('https://www.google.com/'),
  });
  let { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function getQuestionId() {
      const response = await axios.get(`http://localhost:3000/topic/${id}`, {
        withCredentials: true,
      });
      setTopic(response.data);
    }
    getQuestionId();
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
        <Grid item xs={4.5}>
          {topic.questions?.length ? (
            topic.questions.map((question: any) => {
              return (
                <ListItem key={question.id}>
                  <QuestionCard question={question} />
                </ListItem>
              );
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

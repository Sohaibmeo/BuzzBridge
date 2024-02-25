import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopicTypes } from '../types/TopicTypes';
import { AnswerTypes } from '../types/AnswerTypes';

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
                <CardContent sx={{ mb: '2%', backgroundColor: 'white' }}>
                  <Typography variant="h5" component="div">
                    {question.title}
                  </Typography>
                  <Typography color="text.secondary">
                    Question ID: {question.id}
                  </Typography>
                  <Typography color="text.secondary">
                    Belongs To User ID: {question.belongsTo?.id}
                  </Typography>
                  <Typography color="text.secondary">{topic.title}</Typography>
                  <CardMedia
                    component="img"
                    height="fit-content"
                    src={question.picture?.toString()}
                    alt="Question Picture"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Upvotes:{' '}
                    {question.upvotedBy ? question.upvotedBy.length : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Downvote: {question.downvote ? question.downvote : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Answers: //TODO: Change this to have only 2 answers using
                    pagination
                    <ul>
                      {question?.answers
                        ? question.answers.map((answer: AnswerTypes) => (
                            <li key={answer.id}>
                              {answer.description}
                              {answer.belongsTo?.id}
                            </li>
                          ))
                        : 'No answers'}
                    </ul>
                  </Typography>
                </CardContent>
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
          <CardContent sx={{ backgroundColor: 'white' }}>
            <Typography color={'#636466'} textAlign={'center'}>
              Advertisement
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </>
  );
};

export default Topic;

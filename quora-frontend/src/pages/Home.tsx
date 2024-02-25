import { CardContent, CardMedia, Grid, Link, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Answer } from '../types/AnswerTypes';
import { TopicTypes } from '../types/TopicTypes';

const HomePage = () => {
  const [topics, setTopics] = useState<any>([{}]);
  const [questions, setQuestions] = useState<any>([{}]);

  useEffect(() => {
    const apiCalls = async () => {
      try {
        const topics: AxiosResponse = await axios.get(
          'http://localhost:3000/topic',
        );
        setTopics(topics.data);
        const questions: AxiosResponse = await axios.get(
          'http://localhost:3000/question',
        );
        setQuestions(questions.data);

        console.log('Results: ', topics, questions);
      } catch (error) {
        console.log('ERR:UseEffectApiCALL' + error);
      }
    };
    apiCalls();
  }, []);
  return (
    <>
      <Grid container columnGap={5} justifyContent={'end'} sx={{ mt: '2%' }}>
        <Grid
          item
          xs={1}
          sx={{
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            borderRadius: '3px',
          }}
        >
          {topics ? (
            topics.map((topic: any) => {
              return (
                <Link href={`/topic/${topic.id}`} underline='none'>
                  <CardContent
                    sx={{
                      display: 'flex',
                      width: '100%',
                      ":hover": {
                          backgroundColor: '#d2d4d9',
                          cursor: 'pointer',
                          position: 'sticky',
                          borderRadius: '3px',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={topic.picture?.toString()}
                      style={{
                        borderRadius: '3px',
                        width: '20px',
                        height: '20px',
                        marginRight: '5%',
                      }}
                      alt=""
                    />
                    <Typography color={'#636466'} lineHeight={1.2}>
                      {topic.title}
                    </Typography>
                  </CardContent>
                </Link>
              );
            })
          ) : (
            <div>Loading Topics</div>
          )}
        </Grid>
        <Grid item xs={4.5}>
          {questions.length > 0 ? (
            questions.map((question: any) => {
              return (
                <>
                  <CardContent sx={{ backgroundColor: 'white', mb: '2%' }}>
                    <Link href={`/question/${question.id}`} underline='none' sx={{":hover":{textDecoration:'underline',color:'black'}}}>
                        <Typography variant="h6" color="text.primary">
                            {question.title}
                        </Typography>
                    </Link>
                    <Typography color="text.secondary">
                      Question ID: {question.id}
                    </Typography>
                    <Typography color="text.secondary">
                      Belongs To User ID: {question.belongsTo?.id}
                    </Typography>
                    <Typography color="text.secondary">
                      {question.assignedTopics
                        ?.map((topic: TopicTypes) => topic.title)
                        .join(', ')}
                    </Typography>
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
                      Answers://TODO: Change this to have only 2 answers using
                      pagination
                      <ul>
                        {question.answers
                          ? question.answers.map((answer: Answer) => (
                              <li key={answer.id}>
                                {answer.description}
                                {answer.belongsTo?.id}
                              </li>
                            ))
                          : 'No answers'}
                      </ul>
                    </Typography>
                  </CardContent>
                </>
              );
            })
          ) : (
            <CardContent>
              <Typography>No Questions</Typography>
            </CardContent>
          )}
        </Grid>
        <Grid item xs={3.5}>
          Whatever is this
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;

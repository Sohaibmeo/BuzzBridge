import React, { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import UserCard from '../components/Cards/UserCard';
import { QuestionType } from '../types/QuestionTypes';
import { useAlert } from '../components/Providers/AlertProvider';
import QuestionCard from '../components/Cards/QuestionCard';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const About = () => {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<QuestionType[] | null>(null);
  const { showAlert } = useAlert();
  //eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`http://localhost:3000/user/${id}`);
        setUser(response.data);
      } catch (error) {
        showAlert('error', 'Error fetching user');
      }
    }
    async function fetchQuestions() {
      try {
        const response = await axios.get(
          `http://localhost:3000/question/answered`,
          { withCredentials: true },
        );
        setQuestions(response.data);
      } catch (error: any) {
        showAlert('error', 'Error fetching questions');
        if (error.response.status === 401) {
          navigate('/login');
          removeCookie('jwt');
        }
      }
    }
    fetchQuestions();
    fetchUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {questions ? (
                questions.map((question: QuestionType, index: number) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    imageEnabled={false}
                    getAnswerBy={user.id}
                    displayAnswers={true}
                  />
                ))
              ) : (
                <Typography variant="h5">No questions to show</Typography>
              )}
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
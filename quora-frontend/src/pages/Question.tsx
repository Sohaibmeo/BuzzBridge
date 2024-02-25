import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuestionType } from '../types/QuestionTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import QuestionCard from '../components/Cards/QuestionCard';

const Question = () => {
  const [question, setQuestion] = useState<QuestionType>({
    id: 0,
    title: '',
  });
  let { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function getQuestionId() {
      const response = await axios.get(`http://localhost:3000/question/${id}`, {
        withCredentials: true,
      });
      setQuestion(response.data);
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
        <Grid item xs={4.5} sx={{ backgroundColor: 'white' }}>
          <QuestionCard
            question={question}
            displayAnswers={true}
            postAnswer={true}
            setQuestion={setQuestion}
          />
        </Grid>
        <Grid item xs={3.5}>
          <AdvertisementCard />
        </Grid>
      </Grid>
    </>
  );
};

export default Question;

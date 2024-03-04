import { useEffect, useState } from 'react';
import { QuestionType } from '../types/QuestionTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import QuestionCard from '../components/Cards/QuestionCard';
import useCustomAxios from '../helpers/customAxios';

const Question = () => {
  const [question, setQuestion] = useState<QuestionType>({
    id: 0,
    title: '',
  });
  const axiosInstance = useCustomAxios();
  let { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function getQuestionId() {
      const response = await axiosInstance.get(`/question/${id}`);
      setQuestion(response.data);
    }
    getQuestionId();
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
        <Grid
          item
          xs={4.5}
          sx={{ backgroundColor: 'white', marginBottom: '10rem' }}
        >
          <QuestionCard
            question={question}
            displayAnswers
            postAnswer
            setQuestion={setQuestion}
            enrich
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

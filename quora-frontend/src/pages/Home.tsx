import { Button, CardContent, Grid, Link, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CreateTopicModal from '../components/Modals/CreateTopicModal';
import TopicCard from '../components/Cards/TopicCard';
import QuestionCard from '../components/Cards/QuestionCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import { TopicTypes } from '../types/TopicTypes';
import { QuestionType } from '../types/QuestionTypes';

const HomePage = () => {
  const [topics, setTopics] = useState<any>([{}]);
  const [questions, setQuestions] = useState<any>([{}]);
  const [openCreateTopicModal, setOpenCreateTopicModal] =
    useState<boolean>(false);
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
      } catch (error) {
        console.log('ERR:UseEffectApiCALL' + error);
      }
    };
    apiCalls();
  }, []);
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
            flexDirection: 'column',
            justifyContent: 'end',
            borderRadius: '3px',
          }}
        >
          <Button
            color="inherit"
            onClick={() => setOpenCreateTopicModal(true)}
            sx={{ display: 'flex', justifyContent: 'space-around' }}
          >
            <AddIcon color="warning" />
            <Typography color={'#636466'} variant="inherit">
              Create Topic
            </Typography>
          </Button>
          {topics ? (
            topics.map((topic: TopicTypes, index: number) => {
              return (
                <Link href={`/topic/${topic.id}`} underline="none" key={index}>
                  <TopicCard topic={topic} backgroundColor="#d2d4d9" />
                </Link>
              );
            })
          ) : (
            <div>Loading Topics</div>
          )}
        </Grid>
        <Grid item xs={4.5}>
          {questions.length > 0 ? (
            questions.map((question: QuestionType, index: number) => {
              return (
                <QuestionCard
                  key={index}
                  question={question}
                  displayAnswers={false}
                />
              );
            })
          ) : (
            <CardContent sx={{ backgroundColor: 'white' }}>
              <Typography>No Questions</Typography>
            </CardContent>
          )}
        </Grid>
        <Grid item xs={3.5}>
          <AdvertisementCard />
        </Grid>
      </Grid>
      {openCreateTopicModal && (
        <CreateTopicModal
          openCreateTopicModal={openCreateTopicModal}
          setOpenCreateTopicModal={setOpenCreateTopicModal}
        />
      )}
    </>
  );
};

export default HomePage;

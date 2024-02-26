import { Button, CardContent, Grid, Link, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TopicCard from '../components/Cards/TopicCard';
import QuestionCard from '../components/Cards/QuestionCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import { TopicTypes } from '../types/TopicTypes';
import { QuestionType } from '../types/QuestionTypes';
import { useAlert } from '../components/Providers/AlertProvider';
import CreateModal from '../components/Modals/CreateModal';
import CreateTopicForm from '../components/Forms/CreateTopicForm';

const HomePage = () => {
  const [topics, setTopics] = useState<any>([{}]);
  const [questions, setQuestions] = useState<any>([{}]);
  const { showAlert } = useAlert();
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
      } catch (error: any) {
        showAlert('error', error.message);
      }
    };
    apiCalls();
  }, [showAlert]);
  return (
    <>
      <Grid container columnGap={2} justifyContent={'center'}>
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
                  <TopicCard topic={topic} />
                </Link>
              );
            })
          ) : (
            <div>Loading Topics</div>
          )}
        </Grid>
        <Grid item xs={4}>
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
        <Grid
          item
          xs={2.5}
          sx={{
            position: 'sticky',
            top: '10%',
            height: 'fit-content',
          }}
        >
          <AdvertisementCard />
        </Grid>
      </Grid>
      {openCreateTopicModal && (
        <CreateModal
          openModal={openCreateTopicModal}
          setOpenModal={setOpenCreateTopicModal}
          Children={
            <CreateTopicForm
              setOpenCreateTopicModal={setOpenCreateTopicModal}
            />
          }
        />
      )}
    </>
  );
};

export default HomePage;

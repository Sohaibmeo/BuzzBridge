import { Button, Grid, Link, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
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
import customAxios from '../helpers/customAxios';
import EmptyContentCard from '../components/Cards/EmptyContentCard';

const HomePage = () => {
  const [topics, setTopics] = useState<any>([{}]);
  const [questions, setQuestions] = useState<any>([]);
  const axiosInstance = customAxios();
  const [page, setPage] = useState<number>(1);
  const { showAlert } = useAlert();
  const [openCreateTopicModal, setOpenCreateTopicModal] =
    useState<boolean>(false);
  const fetchQuestions = async () => {
    const limit = 5;
    try {
      const questions: AxiosResponse = await axiosInstance.get(
        `/question?page=${page}&limit=${limit}`,
      );
      setQuestions((prev: any) => [...prev, ...questions.data]);
      setPage((prev) => prev + 1);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };

  const fetchTopics = async () => {
    try {
      const topics: AxiosResponse = await axiosInstance.get(
        '/topic?page=1&limit=5',
      );
      setTopics(topics.data);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTopics();
    // eslint-disable-next-line
  }, []);

  useEffect(
    () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          fetchQuestions();
        }
      };
    },
    // eslint-disable-next-line
    [page],
  );

  return (
    <>
      <Grid container columnGap={2} justifyContent={'center'}>
        <Grid
          item
          xs={1}
          display={{ xs: 'none', sm: 'none', md: 'none', lg: 'flex' }}
          sx={{
            position: 'sticky',
            top: '10%',
            height: 'fit-content',
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
          {topics &&
            topics.map((topic: TopicTypes, index: number) => {
              return (
                <Link href={`/topic/${topic.id}`} underline="none" key={index}>
                  <TopicCard topic={topic} />
                </Link>
              );
            })}
          <Link href="/alltopics" underline="none">
            <Button
              color="inherit"
              sx={{ display: 'flex', justifyContent: 'space-around' }}
            >
              <Typography color={'#636466'} variant="inherit">
                Load All Topics
              </Typography>
            </Button>
          </Link>
        </Grid>
        <Grid item lg={4} xs={12} >
          {questions.length > 0 ? (
            questions.map((question: QuestionType, index: number) => {
              return (
                <QuestionCard
                  key={index}
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
        <Grid
          item
          xs={2.5}
          display={{ xs: 'none', sm: 'none', md: 'none', lg: 'block' }}
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

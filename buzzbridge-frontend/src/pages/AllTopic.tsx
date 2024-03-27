import { Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/Cards/TopicCard';
import AdvertisementCard from '../components/Cards/AdvertisementCard';
import { useEffect, useState } from 'react';
import { useAlert } from '../components/Providers/AlertProvider';
import { AxiosResponse } from 'axios';
import useCustomAxios from '../helpers/customAxios';
import { TopicTypes } from '../types/TopicTypes';

const AllTopic = () => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const { showAlert } = useAlert();
  const [page, setPage] = useState(1);
  const axiosInstance = useCustomAxios();
  const fetchMoreTopics = async () => {
    try {
      const topics: AxiosResponse = await axiosInstance.get(
        `/topic?page=${page}&limit=8`,
      );
      setTopics((prev) => prev.concat(topics.data));
      setPage((prev) => prev + 1);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };
  useEffect(() => {
    fetchMoreTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          fetchMoreTopics();
        }
      };
    },
    // eslint-disable-next-line
    [page],
  );

  const navigate = useNavigate();
  return (
    <Grid container columnGap={2} justifyContent={'center'} sx={{ mt: '2%' }}>
      <Grid
        item
        xs={1}
        display={{ xs:'none', sm: 'none', md: 'none', lg: 'flex' }}
        sx={{
          position: 'sticky',
          top: '10%',
          height: 'fit-content',
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
      <Grid item lg={4.5} xs={11} rowSpacing={5}>
        {topics.map((topic: any, index) => (
          <TopicCard
            key={index}
            topic={topic}
            backgroundColor="white"
            enlarge
            setTopics={setTopics}
          />
        ))}
      </Grid>
      <Grid item xs={3.5} display={{ xs:'none', sm: 'none', md: 'none', lg: 'block' }}>
        <AdvertisementCard />
      </Grid>
    </Grid>
  );
};

export default AllTopic;

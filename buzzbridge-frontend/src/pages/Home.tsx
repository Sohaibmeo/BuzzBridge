import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TopicCard from "../components/Cards/TopicCard";
import AdvertisementCard from "../components/Cards/AdvertisementCard";
import { TopicTypes } from "../types/TopicTypes";
import { useAlert } from "../components/Providers/AlertProvider";
import CreateModal from "../components/Modals/CreateModal";
import CreateTopicForm from "../components/Forms/CreateTopicForm";
import useCustomAxios from "../utils/helpers/customAxios";
import PaginatedQuestions from "../components/Cards/PaginatedQuestions";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [topics, setTopics] = useState<any>([{}]);

  const axiosInstance = useCustomAxios();
  const { showAlert } = useAlert();
  const [openCreateTopicModal, setOpenCreateTopicModal] =
    useState<boolean>(false);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);
  const navigate = useNavigate();
  const displaySizeSmall = useMediaQuery("(max-width:1200px)");
  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const topics: AxiosResponse = await axiosInstance.get(
        `/topic?page=1&limit=${displaySizeSmall ? 2 : 5}`
      );
      setTopics(topics.data);
    } catch (error: any) {
      showAlert("error", error.message);
    }
    setLoadingTopics(false);
  };
  useEffect(() => {
    !displaySizeSmall && fetchTopics();
    // eslint-disable-next-line
  }, [displaySizeSmall]);
  return (
    <>
      <Grid container columnGap={3} justifyContent={"center"}>
        <Grid
          item
          lg={1.2}
          xs={12}
          display={{ lg: "flex", xs: "none" }}
          sx={{
            position: "sticky",
            top: "20px",
            height: "fit-content",
            flexDirection: "column",
            justifyContent: "end",
            borderRadius: "3px",
          }}
        >
          <Button
            color="inherit"
            onClick={() => setOpenCreateTopicModal(true)}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: "50px",
            }}
          >
            <AddIcon color="warning" />
            <Typography color={"#636466"} variant="inherit">
              Create Topic
            </Typography>
          </Button>
          {topics &&
            topics.map((topic: TopicTypes, index: number) => {
              return (
                <Box onClick={() => navigate(`/topic/${topic.id}`)} key={index}>
                  <TopicCard
                    topic={topic}
                    setTopics={setTopics}
                    loading={loadingTopics}
                  />
                </Box>
              );
            })}
          <Button
            color="inherit"
            onClick={() => navigate("/alltopics")}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Typography color={"#636466"} variant="inherit">
              Load All Topics
            </Typography>
          </Button>
        </Grid>
        <Grid item lg={4} xs={12}>
          <PaginatedQuestions firstTab="latest" limit={4} />
        </Grid>
        <Grid
          item
          xs={2.5}
          display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
          sx={{
            position: "sticky",
            top: "20px",
            height: "fit-content",
          }}
        >
          <AdvertisementCard mt="50px"/>
        </Grid>
      </Grid>
      {openCreateTopicModal && (
        <CreateModal
          openModal={openCreateTopicModal}
          setOpenModal={setOpenCreateTopicModal}
          Children={
            <CreateTopicForm
              setOpenCreateTopicModal={setOpenCreateTopicModal}
              setTopics={setTopics}
            />
          }
        />
      )}
    </>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TopicTypes } from "../types/TopicTypes";
import QuestionCard from "../components/Cards/QuestionCard";
import AdvertisementCard from "../components/Cards/AdvertisementCard";
import TopicCard from "../components/Cards/TopicCard";
import useCustomAxios from "../utils/helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";
import EmptyContentCard from "../components/Cards/EmptyContentCard";
import { QuestionType } from "../types/QuestionTypes";

const Topic = () => {
  const [topic, setTopic] = useState<TopicTypes>({
    id: 0,
    title: "",
    description: "",
    picture: new URL("https://www.google.com/"),
  });
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTopic, setLoadingTopic] = useState<boolean>(true);
  const [maxPage, setMaxPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { showAlert } = useAlert();
  let { id } = useParams();
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  async function getTopic() {
    setLoadingTopic(true);
    try {
      const response = await axiosInstance.get(`/topic/${id}`);
      setTopic(response.data);
    } catch (error) {
      navigate("/");
      showAlert("error", "Topic not found");
    }
    setLoadingTopic(false);
  }
  async function getQuestions() {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `question/topic/${id}?page=${page}&limit=5`
      );
      if (response.data.length === 0) {
        setMaxPage(true);
        return setLoading(false);
      }
      setQuestions((prev: any) => prev.concat(response.data));
      setPage((prev) => prev + 1);
    } catch (error) {
      showAlert("error", "Error while fetching questions");
    }
    setLoading(false);
  }
  useEffect(() => {
    if (id) {
      getTopic();
      getQuestions();
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(
    () => {
      if(!loading && !maxPage){
        const handleScroll = () => {
          if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
          ) {
            getQuestions();
            window.removeEventListener("scroll", handleScroll);
          }
        };
  
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }
    },
    // eslint-disable-next-line
    [page,loading, maxPage]
  );

  return (
    <>
      <Grid container columnGap={2} justifyContent={"center"} sx={{ mt: "2%" }}>
        <Grid
          item
          xs={1}
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
          sx={{
            position: "sticky",
            top: "5%",
            height: "fit-content",
            justifyContent: "end",
            borderRadius: "3px",
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
          <TopicCard
            topic={topic}
            backgroundColor="white"
            enlarge
            setTopic={setTopic}
            loading={loadingTopic}
          />
          {questions.length > 0 ? (
            questions.map((question: any) => {
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  displayAnswers
                  setQuestions={setQuestions}
                  loading={loading}
                />
              );
            })
          ) : (
            <EmptyContentCard type="question" loading={loading} />
          )}
        </Grid>
        <Grid
          item
          xs={3.5}
          display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
        >
          <AdvertisementCard />
        </Grid>
      </Grid>
    </>
  );
};

export default Topic;

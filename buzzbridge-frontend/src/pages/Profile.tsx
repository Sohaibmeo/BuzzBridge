import { useEffect, useState } from "react";
import { User } from "../types/UserTypes";
import UserCard from "../components/Cards/UserCard";
import { Box, Button, Grid, Tab, Tabs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import useCustomAxios from "../utils/helpers/customAxios";
import AdvertisementCard from "../components/Cards/AdvertisementCard";
import PaginatedCards from "../components/Cards/PaginatedCards";
import { useAlert } from "../components/Providers/AlertProvider";
import { AnswerTypes } from "../types/AnswerTypes";
import { QuestionType } from "../types/QuestionTypes";
import { TopicTypes } from "../types/TopicTypes";

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<AnswerTypes[]>([]);
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [followings, setFollowings] = useState<TopicTypes[]>([]);
  const [usersPageCount, setUserPageCount] = useState<any>({
    questionPageCount: 1,
    answerPageCount: 1,
    topicPageCount: 1,
    followingPageCount: 1,
  });
  const axiosInstance = useCustomAxios();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("question");
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const { id } = useParams();
  const handleLoadData = async (
    tab: string,
    limit: number,
    buttonCall: boolean
  ) => {
    setLoading(true);
    setCurrentTab(tab);
    try {
      const page = usersPageCount[`${tab}PageCount`] || 1;
      if (page > 1 && buttonCall) return;
      const URL =
        tab === "following"
          ? `topic/user/${id}/following?page=${page}&limit=${limit}`
          : `${tab}/user/${id}?page=${page}&limit=${limit}`;
      const response = await axiosInstance.get(URL);
      switch (tab) {
        case "question":
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setQuestions((prev) => prev.concat(response.data));
          break;
        case "answer":
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setAnswers((prev) => prev.concat(response.data));
          break;
        case "topic":
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setTopics((prev) => prev.concat(response.data));
          break;
        case "following":
          setUserPageCount((prevCounts: any) => ({
            ...prevCounts,
            [`${tab}PageCount`]: prevCounts[`${tab}PageCount`] + 1,
          }));
          setFollowings((prev) => prev.concat(response.data));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const getCurrentTabData = () => {
    switch (currentTab) {
      case "question":
        return questions;
      case "answer":
        return answers;
      case "topic":
        return topics;
      case "following":
        return followings;
      default:
        return [];
    }
  };
  async function fetchUser() {
    setLoadingUser(true);
    try {
      const response = await axiosInstance.get(`/user/${id}`);
      setUser(response.data);
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      handleLoadData("question", 4, false);
    } catch (error) {
      navigate("/");
      showAlert("error", "User not found");
    }
    setLoadingUser(false);
  }

  const switchTabContent = ["question", "answer", "topic", "following"];
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  useEffect(
    () => {
      window.onscroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          handleLoadData(currentTab, 4, false);
        }
      };
    },
    // eslint-disable-next-line
    [
      usersPageCount.questionPageCount,
      usersPageCount.answerPageCount,
      usersPageCount.topicPageCount,
      usersPageCount.followingPageCount,
      currentTab,
    ]
  );

  return (
    <Grid container justifyContent={"center"} columnGap={3}>
      <Grid
        item
        xs={1}
        display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        sx={{
          position: "sticky",
          top: "10%",
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
      <Grid item xs={12} lg={3.5}>
        <UserCard user={user} setUser={setUser} loading={loadingUser} />
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{ width: "fit-content" }}
          >
            {switchTabContent.map((tab, index) => (
              <Tab
                key={index}
                value={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                onClick={() => handleLoadData(tab, 4, true)}
              />
            ))}
          </Tabs>
        </Box>
        <PaginatedCards
          currentTab={currentTab}
          data={getCurrentTabData()}
          setData={
            currentTab === "question"
              ? setQuestions
              : currentTab === "answer"
              ? setAnswers
              : currentTab === "topic"
              ? setTopics
              : setFollowings
          }
          loading={loading}
        />
      </Grid>
      <Grid
        item
        xs={2.5}
        display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
      >
        <AdvertisementCard />
      </Grid>
    </Grid>
  );
};

export default Profile;

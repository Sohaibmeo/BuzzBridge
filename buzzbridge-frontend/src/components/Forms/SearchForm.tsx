import { Grid, IconButton, InputBase, Paper, Tab, Tabs } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { QuestionType } from "../../types/QuestionTypes";
import { TopicTypes } from "../../types/TopicTypes";
import { User } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import MiniTopicCard from "../Cards/Mini/MiniTopicCard";
import MiniQuestionCard from "../Cards/Mini/MiniQuestionCard";
import MiniEmptyCardContent from "../Cards/Mini/MiniEmptyCardContent";
import MiniUserCard from "../Cards/Mini/MiniUserCard";

const SearchForm = () => {
  const [query, setQuery] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("questions");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const [loading, setLoading] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const handleLoadData = async () => {
    if (query) {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(
            `/search?query=${query}&type=${currentTab}`
          );
          setQuestions(data);
          setTopics(data);
          setUsers(data);
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          showAlert("error", error?.response?.data?.message);
        }
      }, 700);
    }
  };

  useEffect(() => {
    handleLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, query]);

  const switchTabContent = ["questions", "topics", "users"];
  return (
    <>
      <Paper
        sx={{
          p: "2px 4px",
          mt: "11px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          autoFocus
          sx={{ ml: 1, flex: 1 }}
          placeholder="What are you looking for?"
          onChange={handleChange}
          inputProps={{ "aria-label": "What are you looking for?" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Grid>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            textColor="secondary"
            indicatorColor="secondary"
            sx={{
              marginBottom: "2%",
            }}
          >
            {switchTabContent.map((tab, index) => (
              <Tab
                key={index}
                value={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                onClick={() => setCurrentTab(tab)}
              />
            ))}
          </Tabs>
        </Grid>
        {currentTab === "topics" && (
          <>
            {topics && topics.length > 0 ? (
              <>
                {topics.map((topic: TopicTypes) => (
                  <MiniTopicCard
                    key={topic.id}
                    topic={topic}
                    loading={loading}
                  />
                ))}
              </>
            ) : (
              <MiniEmptyCardContent loading={loading} />
            )}
          </>
        )}
        {currentTab === "questions" && (
          <>
            {questions && questions.length > 0 ? (
              <>
                {questions.map((question: QuestionType) => (
                  <MiniQuestionCard
                    key={question.id}
                    loading={loading}
                    question={question}
                  />
                ))}
              </>
            ) : (
              <MiniEmptyCardContent loading={loading} />
            )}
          </>
        )}
        {currentTab === "users" && (
          <>
            {users && users.length > 0 ? (
              <>
                {users.map((user: User) => (
                  <MiniUserCard key={user.id} user={user} loading={loading} />
                ))}
              </>
            ) : (
              <MiniEmptyCardContent loading={loading} />
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default SearchForm;

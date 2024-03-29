import {
  Box,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { QuestionType } from "../../types/QuestionTypes";
import { TopicTypes } from "../../types/TopicTypes";
import { User } from "../../types/UserTypes";
import EmptyContentCard from "../Cards/EmptyContentCard";
import { useAlert } from "../Providers/AlertProvider";

const SearchForm = () => {
  const [currentTab, setCurrentTab] = useState<string>("questions");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (e: any) => {
    setLoading(true);
    try {
      switch (currentTab) {
        case "questions":
          setQuestions([]);
          break;
        case "topics":
          setTopics([]);
          break;
        case "users":
          setUsers([]);
          break;
        default:
          break;
      }
    } catch (error) {
      showAlert("error", "Error while fetching results");
    }
    setLoading(false);
  };

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
        {loading ? (
          <>
            {currentTab === "topics" && (
              <>
                {topics && topics.length > 0 ? (
                  <Typography>Topics</Typography>
                ) : (
                  <EmptyContentCard type="topic" />
                )}
              </>
            )}
            {currentTab === "questions" && (
              <>
                {questions && questions.length > 0 ? (
                  <Typography>Questions</Typography>
                ) : (
                  <EmptyContentCard type="question" />
                )}
              </>
            )}
            {currentTab === "users" && (
              <>
                {users && users.length > 0 ? (
                  <Typography>Users</Typography>
                ) : (
                  <EmptyContentCard type="user" />
                )}
              </>
            )}
          </>
        ) : (
          <Box>
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton variant="rectangular" height={50} />
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton variant="rectangular" height={50} />
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton variant="rectangular" height={50} />
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton variant="rectangular" height={50} />
          </Box>
        )}
      </Grid>
    </>
  );
};

export default SearchForm;

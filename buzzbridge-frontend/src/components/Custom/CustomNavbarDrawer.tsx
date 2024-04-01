import {
  Box,
  Button,
  CardMedia,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TopicTypes } from "../../types/TopicTypes";
import AddIcon from "@mui/icons-material/Add";
import TopicCard from "../Cards/TopicCard";
import useCustomAxios from "../../utils/helpers/customAxios";
import CreateModal from "../Modals/CreateModal";
import CreateTopicForm from "../Forms/CreateTopicForm";
import ProfileSettingsItems from "./ProfileSettingsItems";
import { useUser } from "../Providers/UserProvider";
import CustomSearchBar from "./CustomSearchBar";
import { useNavigate } from "react-router-dom";

const CustomNavbarDrawer = ({
  open,
  setOpen,
  setOpenQuestionModal,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setOpenQuestionModal: (open: boolean) => void;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const navigate = useNavigate();
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);
  const [openCreateTopicModal, setOpenCreateTopicModal] =
    useState<boolean>(false);
  const axiosInstance = useCustomAxios();
  const displaySizeSmall = useMediaQuery("(max-width: 1200px)");
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const response = await axiosInstance.get("/topic?page=1&limit=5");
      setTopics(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoadingTopics(false);
  };
  useEffect(() => {
    displaySizeSmall && currentUser && fetchTopics();
    //eslint-disable-next-line
  }, [displaySizeSmall, currentUser]);
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        display: { lg: "none" },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "70%",
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Box display={"flex"} justifyContent={"center"}>
        <CardMedia
          component="img"
          image={
            currentUser && currentUser.picture
              ? currentUser.picture.toString()
              : "/user_avatar.png"
          }
          sx={{
            width: "10em",
            mt: "3%",
            height: "10em",
            borderRadius: "50%",
          }}
        />
      </Box>
      <Divider sx={{ margin: "5%" }} />
      <CustomSearchBar />
      <Typography color={"#636466"} variant="inherit" sx={{ margin: "5%" }}>
        Post Something
      </Typography>
      <Button
        color="inherit"
        onClick={() => setOpenCreateTopicModal(true)}
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <AddIcon color="warning" />
        <Typography color={"#636466"} variant="inherit">
          Create Topic
        </Typography>
      </Button>
      <Button
        color="inherit"
        onClick={() => setOpenQuestionModal(true)}
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
          mt: 2,
        }}
      >
        <AddIcon color="warning" />
        <Typography color={"#636466"} variant="inherit">
          Post Questions
        </Typography>
      </Button>
      <Divider sx={{ margin: "5%" }} />
      <Typography color={"#636466"} variant="inherit" sx={{ margin: "5%" }}>
        Popular Topics
      </Typography>
      {topics &&
        topics.map((topic: TopicTypes, index: number) => {
          return (
            <Box
              onClick={() => {
                navigate(`/topic/${topic.id}`);
                setOpen(false);
              }}
              key={index}
            >
              <TopicCard
                topic={topic}
                smallScreen
                backgroundColor="white"
                setTopics={setTopics}
                loading={loadingTopics}
              />
            </Box>
          );
        })}
      <Button
        onClick={() => {
          navigate("/alltopics");
          setOpen(false);
        }}
        color="inherit"
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
      <Divider sx={{ margin: "5%" }} />
      <Typography color={"#636466"} variant="inherit" sx={{ margin: "5%" }}>
        Settings
      </Typography>
      <ProfileSettingsItems
        handleMenuClose={() => setOpen(false)}
        insideDrawer
      />

      {openCreateTopicModal && (
        <CreateModal
          openModal={openCreateTopicModal}
          setOpenModal={setOpenCreateTopicModal}
          width={300}
          Children={
            <CreateTopicForm
              setOpenCreateTopicModal={setOpenCreateTopicModal}
              setTopics={setTopics}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default CustomNavbarDrawer;

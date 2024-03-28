import { useEffect, useState } from "react";
import { AnswerTypes } from "../../types/AnswerTypes";
import {
  Box,
  CardContent,
  CardMedia,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import { useAlert } from "../Providers/AlertProvider";
import CustomMoreHorizIcon from "../Custom/CustomMoreHorizIcon";
import CustomPopover from "../Common/CustomPopover";
import { useUser } from "../Providers/UserProvider";
import CustomUpvoteDownvote from "../Common/CustomUpvoteDownvote";
import useCustomAxios from "../../utils/helpers/customAxios";

const AnswerCard = ({
  answer,
  setAnswers,
  loading,
}: {
  answer: AnswerTypes;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerTypes[]>>;
  loading: boolean;
}) => {
  const { getCurrentUser } = useUser();
  const currentUserId = getCurrentUser()?.id;
  const { expireCurrentUserSession } = useUser();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { showAlert } = useAlert();
  const [userHoverAnchorEl, setUserHoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const axiosInstance = useCustomAxios();
  const picture =
    answer?.belongsTo?.picture?.toString() ||
    process.env.PUBLIC_URL + "/user_avatar.png";
  const handleUpvote = async () => {
    try {
      await axiosInstance.post(`/answer/${answer.id}/upvote`);
      const addAmount = downvoted ? 2 : 1;
      setUpvoted(true);
      if (downvoted) {
        setDownvoted(false);
      }
      setUpvoteCount((prev) => prev + addAmount);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        expireCurrentUserSession();
        showAlert("error", "You need to be logged in to upvote");
      } else {
        showAlert("error", "Something went wrong");
      }
    }
  };
  const handleRemoveUpvote = async () => {
    try {
      await axiosInstance.post(`/answer/${answer.id}/removeupvote`);
      setUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        expireCurrentUserSession();
        showAlert("error", "You need to be logged in to do this");
      } else {
        showAlert("error", "Something went wrong");
      }
    }
  };
  const handleDownvote = async () => {
    try {
      await axiosInstance.post(`/answer/${answer.id}/downvote`);
      const removeAmount = upvoted ? 2 : 1;
      setDownvoted(true);
      if (upvoted) {
        setUpvoted(false);
      }
      setUpvoteCount((prev) => prev - removeAmount);
      showAlert(
        "success",
        "This quetion has been downvoted and will be shown to less people"
      );
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 401) {
        expireCurrentUserSession();
        showAlert("error", "You need to be logged in to do this");
      } else {
        showAlert("error", "Something went wrong");
      }
    }
  };
  const handleRemoveDownvote = async () => {
    try {
      setDownvoted(false);
      await axiosInstance.post(`/answer/${answer.id}/removedownvote`);
      setUpvoteCount((prev) => prev + 1);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        expireCurrentUserSession();
        showAlert("error", "You need to be logged in to do this");
      } else {
        showAlert("error", "Something went wrong");
      }
    }
  };
  useEffect(() => {
    //upvoted by should be Id's here maybe? use select or some other way to get the id's
    if (answer.upvotedBy?.some((user: any) => user.id === currentUserId)) {
      setUpvoted(true);
    }
    if (answer.downvotedBy?.some((user: any) => user.id === currentUserId)) {
      setDownvoted(true);
    }
    setUpvoteCount(answer?.score || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, currentUserId]);
  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
    }
    // eslint-disable-next-line
  },[loading])
  return (
    <>
      <CardContent
        sx={{
          position: "relative",
          ":after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: "0",
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
            width: "100%",
            height: "0.1rem",
            backgroundColor: "#d2d4d9",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={`/profile/${answer.belongsTo?.id}`}
            underline="none"
            sx={{
              display: "flex",
              width: "fit-content",
              ":hover": {
                textDecoration: "underline",
                color: "#636466",
              },
            }}
            onMouseEnter={(e) => setUserHoverAnchorEl(e.currentTarget)}
            onMouseLeave={() => setUserHoverAnchorEl(null)}
          >
            {loaded ? (
              <Typography
                color="text.secondary"
                display={"flex"}
                columnGap={1}
                alignItems={"center"}
                textTransform={"capitalize"}
                width={"fit-content"}
              >
                <CardMedia
                  component="img"
                  src={picture}
                  loading="lazy"
                  alt="Question Picture"
                  sx={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                  }}
                />
                {answer.belongsTo?.name}
              </Typography>
            ) : (
              <>
                <Skeleton variant="circular" width={50} height={50} />
                <Skeleton variant="text" width={100} sx={{ ml: "5%" }} />
              </>
            )}
          </Link>
          <CustomMoreHorizIcon
            id={answer.id}
            type={"answer"}
            defaultFormValues={answer}
            setData={setAnswers}
            setSingleData={()=>{}}
          />
        </Box>
        {loaded ? (
          <Typography variant="h6">{answer.description}</Typography>
        ) : (
          <Skeleton variant="text" width={"100%"} height={40} />
        )}
        {loaded ? (
          <Box sx={{ display: "flex" }}>
            <CustomUpvoteDownvote
              upvoted={upvoted}
              downvoted={downvoted}
              handleDownvote={handleDownvote}
              handleUpvote={handleUpvote}
              handleRemoveDownvote={handleRemoveDownvote}
              handleRemoveUpvote={handleRemoveUpvote}
              upvoteCount={upvoteCount}
            />
          </Box>
        ) : (
          <Skeleton
            variant="rectangular"
            width={100}
            height={30}
            sx={{ mt: "1%" }}
          />
        )}
      </CardContent>
      <CustomPopover
        anchorEl={userHoverAnchorEl}
        setAnchorEl={setUserHoverAnchorEl}
        data={answer.belongsTo}
        currentTab={"user"}
      />
    </>
  );
};

export default AnswerCard;

import {
  Box,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import { QuestionType } from "../../types/QuestionTypes";
import { AnswerTypes } from "../../types/AnswerTypes";
import CreateAnswerForm from "../Forms/CreateAnswerForm";

import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import AnswerCard from "./AnswerCard";
import { useEffect, useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import CustomMoreHorizIcon from "../Custom/CustomMoreHorizIcon";
import CustomPopover from "../Common/CustomPopover";
import EmptyContentCard from "./EmptyContentCard";
import { useUser } from "../Providers/UserProvider";
import CustomUpvoteDownvote from "../Common/CustomUpvoteDownvote";
import { isVideo } from "../../utils/helpers/checkVideo";
import { useNavigate } from "react-router-dom";

const QuestionCard = ({
  question,
  imageEnabled = true,
  backgroundColor = "#fff",
  enrich = false,
  setQuestions,
  setQuestion,
  loading,
}: {
  question: QuestionType;
  displayAnswers?: boolean;
  imageEnabled?: boolean;
  backgroundColor?: string;
  enrich?: boolean;
  setQuestions?: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setQuestion?: React.Dispatch<React.SetStateAction<QuestionType>>;
  loading: boolean;
}) => {
  const { getCurrentUser, expireCurrentUserSession } = useUser();
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentUser = getCurrentUser();
  const [upvoted, setUpvoted] = useState<null | boolean>(null);
  const [exploreMore, setExploreMore] = useState(false);
  const { showAlert } = useAlert();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const picture =
    question?.belongsTo?.picture?.toString() ||
    process.env.PUBLIC_URL + "/user_avatar.png";
  const axiosInstance = useCustomAxios();
  const [answers, setAnswers] = useState<AnswerTypes[]>([]);
  const [userHoverAnchorEl, setUserHoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [answerPageCount, setAnswerPageCount] = useState(1);

  const handleLoadData = async (limit: number) => {
    setLoadingAnswers(true);
    try {
      setExploreMore((exploreMore) => !exploreMore);
      const requestURL = `answer/question/${question.id}?page=${answerPageCount}&limit=${limit}`;
      if ((!exploreMore || enrich) && answers.length === 0 && question.id) {
        const response = await axiosInstance.get(requestURL);
        setAnswers((prev) => prev.concat(response.data));
        setAnswerPageCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingAnswers(false);
  };
  const handleLoadMoreData = async (limit: number) => {
    setLoadingAnswers(true);
    try {
      const response = await axiosInstance.get(
        `answer/question/${question.id}?page=${answerPageCount}&limit=${limit}`
      );
      setAnswers((prev) => prev.concat(response.data));
      setAnswerPageCount((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
    setLoadingAnswers(false);
  };

  const handleUpvote = async () => {
    try {
      await axiosInstance.post(`/question/${question.id}/upvote`);
      const addAmount = upvoted === false ? 2 : 1;
      setUpvoted(true);
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
      await axiosInstance.post(`/question/${question.id}/removeupvote`);
      setUpvoted(null);
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
      await axiosInstance.post(`/question/${question.id}/downvote`);
      const removeAmount = upvoted ? 2 : 1;
      setUpvoted(false);
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
      setUpvoted(null);
      await axiosInstance.post(`/question/${question.id}/removedownvote`);
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
    if (
      currentUser?.upvotedQuestions.some(
        (upvoted: QuestionType) => question.id === upvoted.id
      )
    ) {
      setUpvoted(true);
    }
    if (
      currentUser?.downvotedQuestions.some(
        (downvoted: QuestionType) => question.id === downvoted.id
      )
    ) {
      setUpvoted(false);
    }
    setUpvoteCount(question?.score || 0);
    if (enrich && answers.length === 0) {
      handleLoadData(5);
    }
    // eslint-disable-next-line
  }, [question, currentUser]);

  useEffect(
    () => {
      if (enrich) {
        window.onscroll = () => {
          if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
          ) {
            handleLoadMoreData(5);
          }
        };
      }
    },
    // eslint-disable-next-line
    [answerPageCount]
  );

  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <>
      <Box
        sx={{
          backgroundColor: { backgroundColor },
          marginBottom: "1rem",
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {loaded ? (
              <Box
                onClick={() => navigate(`/profile/${question.belongsTo?.id}`)}
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
                    alt="User Avatar"
                    sx={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                    }}
                  />
                  {question.belongsTo?.name}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  width: "fit-content",
                  ":hover": {
                    textDecoration: "underline",
                    color: "#636466",
                  },
                }}
              >
                <Skeleton variant="circular" width={50} height={50} />
                <Skeleton sx={{ ml: "10%" }} variant="text" width={100} />
              </Box>
            )}
            {loaded ? (
              <CustomMoreHorizIcon
                id={question.id}
                type={"question"}
                defaultFormValues={question}
                setData={setQuestions}
                setSingleData={setQuestion}
              />
            ) : (
              <Skeleton variant="circular" width={50} height={50} />
            )}
          </Box>
          {loaded ? (
            <Box
              onClick={() => navigate(`/question/${question.id}`)}
              sx={{
                display: "flex",
                width: "fit-content",
                ":hover": {
                  textDecoration: "underline",
                  color: "black",
                },
              }}
            >
              <Typography variant="h6" color="text.primary">
                {question.title}
              </Typography>
            </Box>
          ) : (
            <Skeleton variant="text" width={200} />
          )}

          {loaded ? (
            <>
              {imageEnabled && question.picture && (
                <>
                  {isVideo(question.picture.toString()) ? (
                    <CardMedia
                      component="video"
                      height="fit-content"
                      controls
                      src={question.picture.toString()}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      loading="lazy"
                      height="fit-content"
                      onLoad={() => setImageLoaded(true)}
                      src={
                        imageLoaded
                          ? question.picture.toString()
                          : question.picture.toString() + "?tr=bl-20"
                      }
                      alt="Question Picture"
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <Skeleton variant="rectangular" width={"100%"} height={200} />
          )}

          {loaded ? (
            <Box sx={{ display: "flex", mt: "10px", alignContent: "center" }}>
              <CustomUpvoteDownvote
                upvoted={upvoted}
                handleDownvote={handleDownvote}
                handleUpvote={handleUpvote}
                handleRemoveDownvote={handleRemoveDownvote}
                handleRemoveUpvote={handleRemoveUpvote}
                upvoteCount={upvoteCount}
              />
              {!enrich &&
                (exploreMore ? (
                  <ModeCommentIcon
                    color="primary"
                    onClick={() => handleLoadData(2)}
                    sx={{ p: "2%", fontSize: "26px" }}
                  />
                ) : (
                  <ModeCommentOutlinedIcon
                    color="primary"
                    onClick={() => handleLoadData(2)}
                    sx={{ p: "2%", fontSize: "26px" }}
                  />
                ))}
            </Box>
          ) : (
            <Skeleton
              variant="rectangular"
              width={100}
              height={30}
              sx={{ mt: "5%" }}
            />
          )}
          {loaded ? (
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#e0e0e0",
              }}
            >
              <CreateAnswerForm
                questionId={question.id}
                setAnswers={setAnswers}
              />
            </Box>
          ) : (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={80}
              sx={{ mt: "10px" }}
            />
          )}
        </CardContent>

        {(exploreMore || enrich) && (
          <Box>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#e0e0e0",
              }}
            ></Box>
            {answers && answers.length > 0 ? (
              <Box>
                {answers.map((answer: AnswerTypes, index: number) => (
                  <AnswerCard
                    key={index}
                    answer={answer}
                    setAnswers={setAnswers}
                    loading={loadingAnswers}
                  />
                ))}
                {!enrich && (
                  <ArrowDownwardOutlinedIcon
                    onClick={() => handleLoadMoreData(2)}
                    sx={{
                      width: "100%",
                      ":hover": { backgroundColor: "#d2d4d9" },
                    }}
                  />
                )}
              </Box>
            ) : (
              <EmptyContentCard type="answer" loading={loadingAnswers} />
            )}
          </Box>
        )}
      </Box>
      <CustomPopover
        anchorEl={userHoverAnchorEl}
        setAnchorEl={setUserHoverAnchorEl}
        data={question.belongsTo}
        currentTab={"user"}
      />
    </>
  );
};

export default QuestionCard;

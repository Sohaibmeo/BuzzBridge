import { Box, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { QuestionType } from '../../types/QuestionTypes';
import { AnswerTypes } from '../../types/AnswerTypes';
import CreateAnswerForm from '../Forms/CreateAnswerForm';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import AnswerCard from './AnswerCard';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import useJwtExtractId from '../../helpers/jwtExtracId';
import useCustomAxios from '../../helpers/customAxios';

const QuestionCard = ({
  question,
  postAnswer = false,
  setQuestion = () => {},
  imageEnabled = true,
  backgroundColor = '#fff',
  enrich = false,
}: {
  question: QuestionType;
  displayAnswers?: boolean;
  postAnswer?: boolean;
  setQuestion?: React.Dispatch<React.SetStateAction<QuestionType>>;
  imageEnabled?: boolean;
  backgroundColor?: string;
  enrich?: boolean;
}) => {
  const currentUserId = useJwtExtractId();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [exploreMore, setExploreMore] = useState(false);
  const { showAlert } = useAlert();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const picture =
    question?.belongsTo?.picture?.toString() ||
    process.env.PUBLIC_URL + '/user_avatar.png';
  const axiosInstance = useCustomAxios();
  const [answers, setAnswers] = useState<AnswerTypes[]>([]);
  const [answerPageCount, setAnswerPageCount] = useState(1);

  const handleLoadData = async (limit?: number) => {
    try {
      setExploreMore((exploreMore) => !exploreMore);
      const requestURL = enrich
        ? `answer/question/${question.id}`
        : `answer/question/${question.id}?page=${answerPageCount}&limit=${limit}`;
      if ((!exploreMore || enrich) && answers.length === 0 && question.id) {
        const response = await axiosInstance.get(requestURL);
        setAnswers((prev) => prev.concat(response.data));

        setAnswerPageCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoadMoreData = async () => {
    try {
      const response = await axiosInstance.get(
        `answer/question/${question.id}?page=${answerPageCount}&limit=2`,
      );
      setAnswers((prev) => prev.concat(response.data));
      setAnswerPageCount((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpvote = async () => {
    try {
      await axiosInstance.post(`/question/${question.id}/upvote`);
      const addAmount = downvoted ? 2 : 1;
      setUpvoted(true);
      if (downvoted) {
        setDownvoted(false);
      }
      setUpvoteCount((prev) => prev + addAmount);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        showAlert('error', 'You need to be logged in to upvote');
      } else {
        showAlert('error', 'Something went wrong');
      }
    }
  };
  const handleRemoveUpvote = async () => {
    try {
      await axiosInstance.post(`/question/${question.id}/removeupvote`);
      setUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        showAlert('error', 'You need to be logged in to do this');
      } else {
        showAlert('error', 'Something went wrong');
      }
    }
  };
  const handleDownvote = async () => {
    try {
      await axiosInstance.post(`/question/${question.id}/downvote`);
      const removeAmount = upvoted ? 2 : 1;
      setDownvoted(true);
      if (upvoted) {
        setUpvoted(false);
      }
      setUpvoteCount((prev) => prev - removeAmount);
      showAlert(
        'success',
        'This quetion has been downvoted and will be shown to less people',
      );
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 401) {
        showAlert('error', 'You need to be logged in to do this');
      } else {
        showAlert('error', 'Something went wrong');
      }
    }
  };
  const handleRemoveDownvote = async () => {
    try {
      setDownvoted(false);
      await axiosInstance.post(`/question/${question.id}/removedownvote`);
      setUpvoteCount((prev) => prev + 1);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        showAlert('error', 'You need to be logged in to do this');
      } else {
        showAlert('error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    if (question.upvotedBy?.some((user: any) => user.id === currentUserId)) {
      setUpvoted(true);
    }
    if (question.downvotedBy?.some((user: any) => user.id === currentUserId)) {
      setDownvoted(true);
    }
    setUpvoteCount(question?.score || 0);
    if (enrich && answers.length === 0) {
      handleLoadData();
    }
    // eslint-disable-next-line
  }, [question, currentUserId]);

  return (
    <Box sx={{ backgroundColor: { backgroundColor }, marginBottom: '1rem' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link
            href={`/profile/${question.belongsTo?.id}`}
            underline="none"
            sx={{
              display: 'flex',
              width: 'fit-content',
              ':hover': {
                textDecoration: 'underline',
                color: '#636466',
              },
            }}
          >
            <Typography
              color="text.secondary"
              display={'flex'}
              columnGap={1}
              alignItems={'center'}
              textTransform={'capitalize'}
              width={'fit-content'}
            >
              <CardMedia
                component="img"
                src={picture}
                alt="User Avatar"
                sx={{
                  height: '50px',
                  width: '50px',
                  borderRadius: '50%',
                }}
              />
              {question.belongsTo?.name}
            </Typography>
          </Link>
          <MoreHorizIcon
            color="inherit"
            sx={{
              ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              borderRadius: '50%',
              padding: '0.5rem',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          />
        </Box>
        <Link
          href={`/question/${question.id}`}
          underline="none"
          sx={{
            display: 'flex',
            width: 'fit-content',
            ':hover': {
              textDecoration: 'underline',
              color: 'black',
            },
          }}
        >
          <Typography variant="h6" color="text.primary">
            {question.title}
          </Typography>
        </Link>
        {imageEnabled && question.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={question.picture?.toString()}
            alt="Question Picture"
          />
        )}
        <Box sx={{ display: 'flex' }}>
          {upvoted ? (
            <ThumbUpAltIcon
              color="primary"
              onClick={() => {
                handleRemoveUpvote();
              }}
            />
          ) : (
            <ThumbUpOffAltIcon
              color="primary"
              onClick={() => {
                handleUpvote();
              }}
            />
          )}
          <Typography color="text.secondary">{upvoteCount}</Typography>
          {downvoted ? (
            <ThumbDownAltIcon
              color="error"
              onClick={() => {
                handleRemoveDownvote();
              }}
            />
          ) : (
            <ThumbDownOffAltIcon
              color="primary"
              onClick={() => {
                handleDownvote();
              }}
            />
          )}
          {!enrich &&
            (exploreMore ? (
              <ModeCommentIcon
                color="primary"
                onClick={() => handleLoadData(2)}
                sx={{ mt: 'auto', ml: '0.7%' }}
              />
            ) : (
              <ModeCommentOutlinedIcon
                color="primary"
                onClick={() => handleLoadData(2)}
                sx={{ mt: 'auto', ml: '0.7%' }}
              />
            ))}
        </Box>
      </CardContent>

      {((exploreMore && postAnswer) || enrich) && (
        <Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#e0e0e0',
            }}
          >
            <CreateAnswerForm
              questionId={question.id}
              setAnswers={setAnswers}
            />
          </Box>
          {answers && answers.length > 0 ? (
            <Box>
              {answers.map((answer: AnswerTypes, index: number) => (
                <AnswerCard key={index} answer={answer} />
              ))}
              {!enrich && (
                <ArrowDownwardOutlinedIcon
                  onClick={() => handleLoadMoreData()}
                  sx={{
                    width: '100%',
                    ':hover': { backgroundColor: '#d2d4d9' },
                  }}
                />
              )}
            </Box>
          ) : (
            <Typography variant="h5" color={'inherit'} textAlign={'center'}>
              No Answers
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default QuestionCard;

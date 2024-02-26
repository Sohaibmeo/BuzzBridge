import { Box, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { QuestionType } from '../../types/QuestionTypes';
import { AnswerTypes } from '../../types/AnswerTypes';
import CreateAnswerForm from '../Forms/CreateAnswerForm';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import AnswerCard from './AnswerCard';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import axios from 'axios';
import useJwtExtractId from '../../helpers/jwtExtracId';

const QuestionCard = ({
  question,
  displayAnswers = false,
  postAnswer = false,
  setQuestion = () => {},
  getAnswerBy = null,
  imageEnabled = true,
}: {
  question: QuestionType;
  displayAnswers?: boolean;
  postAnswer?: boolean;
  setQuestion?: React.Dispatch<React.SetStateAction<QuestionType>>;
  getAnswerBy?: number | null;
  imageEnabled?: boolean;
}) => {
  const currentUserId = useJwtExtractId();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const { showAlert } = useAlert();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const axiosInstance = axios.create({
    withCredentials: true,
  });
  const handleUpvote = async () => {
    try {
      await axiosInstance.post(
        `http://localhost:3000/question/${question.id}/upvote`,
        { withCredentials: true },
      );
      const addAmount = downvoted ? 2 : 1;
      setUpvoted(true);
      if(downvoted){
        setDownvoted(false);
      }
      setUpvoteCount((prev) => (prev + addAmount));
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
      await axiosInstance.post(
        `http://localhost:3000/question/${question.id}/removeupvote`,
        { withCredentials: true },
      );
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
      await axiosInstance.post(
        `http://localhost:3000/question/${question.id}/downvote`,
        { withCredentials: true },
      );
      const removeAmount = upvoted ? 2 : 1;
      setDownvoted(true);
      if(upvoted){
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
      await axiosInstance.post(
        `http://localhost:3000/question/${question.id}/removedownvote`,
        { withCredentials: true },
      );
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
    if (question.upvotedBy) {
      setUpvoteCount(
        (question.upvotedBy?.length || 0) - (question.downvotedBy?.length || 0),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);
  return (
    <CardContent
      sx={{
        backgroundColor: 'white',
        mb: '2%',
      }}
    >
      <Link
        href={`/about/${question.belongsTo?.id}`}
        underline="none"
        sx={{
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
            src={'/user_avatar.png'}
            alt="Question Picture"
            sx={{
              height: '50px',
              width: '50px',
              borderRadius: '50%',
            }}
          />
          {question.belongsTo?.name}
        </Typography>
      </Link>

      <Link
        href={`/question/${question.id}`}
        underline="none"
        sx={{
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
      {imageEnabled && (
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
      </Box>
      {postAnswer && (
        <CreateAnswerForm questionId={question.id} setQuestion={setQuestion} />
      )}
      {displayAnswers && (
        <Typography color="text.secondary">
          Answers:
          {question.answers && !getAnswerBy
            ? question.answers.map((answer: AnswerTypes, index: number) => (
                <AnswerCard key={index} answer={answer} />
              ))
            : 'No answers'}
          {getAnswerBy && question.answers && question.answers.length > 0 ? (
            <AnswerCard answer={question.answers[0]} />
          ) : (
            'No answers'
          )}
        </Typography>
      )}
    </CardContent>
  );
};

export default QuestionCard;

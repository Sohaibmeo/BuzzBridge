import { Box, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { QuestionType } from '../../types/QuestionTypes';
import { AnswerTypes } from '../../types/AnswerTypes';
import CreateAnswerForm from '../Forms/CreateAnswerForm';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import AnswerCard from './AnswerCard';
import { User } from '../../types/UserTypes';
import { useState } from 'react';

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
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(question.downvote);
  const [upvoteCount, setUpvoteCount] = useState(question.upvotedBy?.length);
  const handleUpvote = (currentUser: any) => {
    console.log('Upvote');
    setUpvoted(true);
    setUpvoteCount((prev) => (prev ? prev + 1 : 0));
  };
  const handleRemoveUpvote = (currentUser: any) => {
    console.log('Remove Upvote');
    setUpvoted(false);
    setUpvoteCount((prev) => (prev ? prev - 1 : 0));
  };
  const handleDownvote = () => {
    console.log('Downvote');
    setDownvoted(true);
  };
  const handleRemoveDownvote = () => {
    console.log('Remove Downvote');
    setDownvoted(false);
  };
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
        {question.upvotedBy?.some((user: User) => user.id === 85) ||
        upvoteCount ? (
          <ThumbUpAltIcon
            color="error"
            onClick={() => {
              handleRemoveUpvote({ id: 85 });
            }}
          />
        ) : (
          <ThumbUpOffAltIcon
            color="primary"
            onClick={() => {
              handleUpvote({ id: 85 });
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

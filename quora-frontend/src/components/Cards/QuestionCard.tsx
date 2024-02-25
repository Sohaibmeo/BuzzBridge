import { CardContent, CardMedia, Link, Typography } from '@mui/material';
import { QuestionType } from '../../types/QuestionTypes';
import { AnswerTypes } from '../../types/AnswerTypes';
import CreateAnswerForm from '../Forms/CreateAnswerForm';
import AnswerCard from './AnswerCard';

const QuestionCard = ({
  question,
  displayAnswers = false,
  postAnswer = false,
  setQuestion = () => {},
}: {
  question: QuestionType;
  displayAnswers?: boolean;
  postAnswer?: boolean;
  setQuestion?: React.Dispatch<React.SetStateAction<QuestionType>>;
}) => {
  return (
    <CardContent
      sx={{
        backgroundColor: 'white',
        mb: '2%',
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
      <CardMedia
        component="img"
        height="fit-content"
        src={question.picture?.toString()}
        alt="Question Picture"
      />
      <Typography variant="body2" color="text.secondary">
        Upvotes: {question.upvotedBy ? question.upvotedBy.length : 0}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Downvote: {question.downvote ? question.downvote : ''}
      </Typography>
      {postAnswer && (
        <CreateAnswerForm questionId={question.id} setQuestion={setQuestion} />
      )}
      {displayAnswers && (
        <Typography color="text.secondary">
          Answers://TODO: Change this to have only 2 answers using pagination
          {question.answers
            ? question.answers.map((answer: AnswerTypes, index: number) => (
                <AnswerCard key={index} answer={answer} />
              ))
            : 'No answers'}
        </Typography>
      )}
    </CardContent>
  );
};

export default QuestionCard;

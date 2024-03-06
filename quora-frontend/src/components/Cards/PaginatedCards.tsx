import { Box } from '@mui/material';
import QuestionCard from './QuestionCard';
import TopicCard from './TopicCard';
import { AnswerTypes } from '../../types/AnswerTypes';
import AnswerCard from './AnswerCard';
import { QuestionType } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';

const PaginatedCards = ({
  currentTab,
  data,
}: {
  currentTab: string;
  data: any;
}) => {
  return (
    <>
      {currentTab === 'question' && data.length > 0 && (
        <Box>
          {data.map((question: QuestionType, index: number) => (
            <QuestionCard key={index} question={question} />
          ))}
        </Box>
      )}
      {currentTab === 'topic' && data.length > 0 && (
        <Box>
          {data.map((topic: TopicTypes, index: number) => (
            <TopicCard
              key={index}
              topic={topic}
              enlarge
              backgroundColor={'white'}
            />
          ))}
        </Box>
      )}
      {currentTab === 'following' && data.length > 0 && (
        <Box>
          {data.map((topic: TopicTypes, index: number) => (
            <TopicCard
              key={index}
              topic={topic}
              enlarge
              backgroundColor={'white'}
            />
          ))}
        </Box>
      )}
      {currentTab === 'answer' && data.length > 0 && (
        <Box>
          {data.map((answer: AnswerTypes, index: number) => (
            <AnswerCard key={index} answer={answer} />
          ))}
        </Box>
      )}
    </>
  );
};

export default PaginatedCards;

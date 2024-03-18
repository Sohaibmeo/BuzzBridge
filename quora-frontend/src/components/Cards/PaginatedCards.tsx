import QuestionCard from './QuestionCard';
import TopicCard from './TopicCard';
import { AnswerTypes } from '../../types/AnswerTypes';
import AnswerCard from './AnswerCard';
import { QuestionType } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import EmptyContentCard from './EmptyContentCard';

const PaginatedCards = ({
  currentTab,
  data,
}: {
  currentTab: string;
  data: any;
}) => {
  return (
    <>
      { data.length > 0 ?
        <>
          {currentTab === 'question' && (
            <>
              {data.map((question: QuestionType, index: number) => (
                <QuestionCard key={index} question={question} />
              ))}
            </>
          )}
          {currentTab === 'topic' && (
            <>
              {data.map((topic: TopicTypes, index: number) => (
                <TopicCard
                  key={index}
                  topic={topic}
                  enlarge
                  backgroundColor={'white'}
                />
              ))}
            </>
          )}
          {currentTab === 'following' && (
            <>
              {data.map((topic: TopicTypes, index: number) => (
                <TopicCard
                  key={index}
                  topic={topic}
                  enlarge
                  backgroundColor={'white'}
                />
              ))}
            </>
          )}
          {currentTab === 'answer' && (
            <>
              {data.map((answer: AnswerTypes, index: number) => (
                <AnswerCard key={index} answer={answer} />
              ))}
            </>
          )}
        </> : <EmptyContentCard type={currentTab} />
      }
    </>
  );
};

export default PaginatedCards;

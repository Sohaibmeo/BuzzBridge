import { Box, Button } from '@mui/material';
import React from 'react';
import QuestionCard from './QuestionCard';
import TopicCard from './TopicCard';
import { AnswerTypes } from '../../types/AnswerTypes';
import AnswerCard from './AnswerCard';
import { QuestionType } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';

const PaginatedCards = ({ currentTab, data, handleLoadData }: {
    currentTab: string;
    data: any;
    handleLoadData: (tab: string, limit: number) => void;
}) => {
  return (
    <>
      {currentTab === 'question' && data.length > 0 && (
        <Box>
          {data.map((question: QuestionType, index: number) => (
            <QuestionCard key={index} question={question} />
          ))}
          <Button
            variant="text"
            color="inherit"
            onClick={() => handleLoadData(currentTab, 2)}
          >
            Load More
          </Button>
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
          <Button
            variant="text"
            color="inherit"
            onClick={() => handleLoadData(currentTab, 2)}
          >
            Load More
          </Button>
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
          <Button
            variant="text"
            color="inherit"
            onClick={() => handleLoadData(currentTab, 2)}
          >
            Load More
          </Button>
        </Box>
      )}
      {currentTab === 'answer' && data.length > 0 && (
        <Box>
          {data.map((answer: AnswerTypes, index: number) => (
            <AnswerCard key={index} answer={answer} />
          ))}
          <Button
            variant="text"
            color="inherit"
            onClick={() => handleLoadData(currentTab, 4)}
          >
            Load More
          </Button>
        </Box>
      )}
    </>
  );
};

export default PaginatedCards;

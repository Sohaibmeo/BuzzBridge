import React from 'react';
import TopicCard from './TopicCard';
import AnswerCard from './AnswerCard';
import UserCard from './UserCard';

const HoverCards = ({
  currentTab,
  data,
}: {
  currentTab: string;
  data: any;
}) => {
  return (
    <>
      {currentTab === 'user' && data && <UserCard user={data} />}
      {currentTab === 'topic' && data && (
        <TopicCard topic={data} enlarge backgroundColor={'white'} hover />
      )}
      {currentTab === 'answer' && data && <AnswerCard answer={data} hover />}
    </>
  );
};

export default HoverCards;

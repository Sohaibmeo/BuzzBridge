import React from 'react';
import { AnswerTypes } from '../../types/AnswerTypes';
import { CardContent, CardMedia, Typography } from '@mui/material';

const AnswerCard = ({ answer }: { answer: AnswerTypes }) => {
  return (
    <CardContent>
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
        {answer.belongsTo?.name}
      </Typography>
      <Typography variant="h6">{answer.description}</Typography>
    </CardContent>
  );
};

export default AnswerCard;

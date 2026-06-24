import React, { useEffect, useState } from 'react';
import { TopicTypes } from '../../../types/TopicTypes';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { QuestionType } from '../../../types/QuestionTypes';
import { User } from '../../../types/UserTypes';

const MiniCard = ({
  loading,
  data,
  currentTab,
  setOpenModal,
}: {
  loading: boolean;
  data: User | QuestionType | TopicTypes;
  currentTab: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleClick = () => {
    if (currentTab === 'questions') {
      navigate(`/question/${data.id}`);
    } else if (currentTab === 'topics') {
      navigate(`/topic/${data.id}`);
    } else {
      navigate(`/profile/${data.id}`);
    }
    if (setOpenModal) {
      setOpenModal(false);
    }
  };
  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <>
      {loaded ? (
        <CardActionArea
          onClick={handleClick}
          sx={{
            backgroundColor: 'white',
            mb: 1,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: '#e5eaf1',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
            '&:hover': {
              borderColor: '#b7cdf7',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 160ms ease',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.75,
              '&:last-child': { pb: 1.75 },
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: currentTab === 'questions' ? '#e8f0fe' : '#edf7ed',
                color: currentTab === 'questions' ? '#174ea6' : '#1e7e34',
                fontWeight: 800,
              }}
            >
              {('title' in data ? data.title : data.name)?.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{
                  fontWeight: 800,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {'title' in data ? data.title : data.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {'title' in data
                  ? `By ${data.belongsTo?.name || 'Unknown'}`
                  : data.email}
              </Typography>
            </Box>
            <ArrowForwardIosIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </CardContent>
        </CardActionArea>
      ) : (
        <Skeleton
          variant="rounded"
          height={74}
          width={'100%'}
          sx={{ mb: 1, borderRadius: '14px' }}
        />
      )}
    </>
  );
};

export default MiniCard;

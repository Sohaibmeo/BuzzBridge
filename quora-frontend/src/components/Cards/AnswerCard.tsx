import React, { useEffect, useState } from 'react';
import { AnswerTypes } from '../../types/AnswerTypes';
import { Box, CardContent, CardMedia, Link, Typography } from '@mui/material';
import useJwtExtractId from '../../helpers/jwtExtracId';
import { useAlert } from '../Providers/AlertProvider';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import useCustomAxios from '../../helpers/customAxios';
import CustomMoreHorizIcon from '../Custom/CustomMoreHorizIcon';
import CustomPopover from '../Common/CustomPopover';

const AnswerCard = ({
  answer,
  hover,
}: {
  answer: AnswerTypes;
  hover?: boolean;
}) => {
  const currentUserId = useJwtExtractId();
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const { showAlert } = useAlert();
  const [userHoverAnchorEl, setUserHoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const axiosInstance = useCustomAxios();
  const picture =
    answer?.belongsTo?.picture?.toString() ||
    process.env.PUBLIC_URL + '/user_avatar.png';
  const handleUpvote = async () => {
    try {
      await axiosInstance.post(`/answer/${answer.id}/upvote`);
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
      await axiosInstance.post(`/answer/${answer.id}/removeupvote`);
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
      await axiosInstance.post(`/answer/${answer.id}/downvote`);
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
      await axiosInstance.post(`/answer/${answer.id}/removedownvote`);
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
    //upvoted by should be Id's here maybe? use select or some other way to get the id's
    if (answer.upvotedBy?.some((user: any) => user.id === currentUserId)) {
      setUpvoted(true);
    }
    if (answer.downvotedBy?.some((user: any) => user.id === currentUserId)) {
      setDownvoted(true);
    }
    setUpvoteCount(answer?.score || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, currentUserId]);
  return (
    <>
      <CardContent
        sx={{
          position: 'relative',
          ':after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: '0',
            width: '100%',
            height: '0.1rem',
            backgroundColor: '#d2d4d9',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href={`/profile/${answer.belongsTo?.id}`}
            underline="none"
            sx={{
              display: 'flex',
              width: 'fit-content',
              ':hover': {
                textDecoration: 'underline',
                color: '#636466',
              },
            }}
            onMouseEnter={(e) => setUserHoverAnchorEl(e.currentTarget)}
            onMouseLeave={() => setUserHoverAnchorEl(null)}
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
                alt="Question Picture"
                sx={{
                  height: '50px',
                  width: '50px',
                  borderRadius: '50%',
                }}
              />
              {answer.belongsTo?.name}
            </Typography>
          </Link>
          <CustomMoreHorizIcon
            id={answer.id}
            type={'answer'}
            defaultFormValues={answer}
          />
        </Box>
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
        <Typography variant="h6">{answer.description}</Typography>
      </CardContent>
      <CustomPopover
        anchorEl={userHoverAnchorEl}
        setAnchorEl={setUserHoverAnchorEl}
        data={answer.belongsTo}
        currentTab={'user'}
      />
    </>
  );
};

export default AnswerCard;

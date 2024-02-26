import { Button, CardContent, CardMedia, Typography } from '@mui/material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import { TopicTypes } from '../../types/TopicTypes';
import useJwtExtractId from '../../helpers/jwtExtracId';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import axios from 'axios';

const TopicCard = ({
  topic,
  backgroundColor,
  enlarge = false,
}: {
  topic: TopicTypes;
  backgroundColor?: string;
  enlarge?: boolean;
}) => {
  const currentUserId = useJwtExtractId();
  const [follow, setFollow] = useState(false);
  const { showAlert } = useAlert();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const axiosInstance = axios.create({
    withCredentials: true,
  });
  const handleSubmitFollow = async () => {
    if (follow) {
      try {
        const results = await axiosInstance.post(
          `http://localhost:3000/topic/${topic.id}/unfollow`,
        );
        if (results.data === 'Success') {
          setFollow(false);
          setFollowerCount((prev) => prev - 1);
          showAlert('success', 'Unfollowed ' + topic.title);
        } else {
          showAlert('error', 'Unexpected error occurred');
        }
      } catch (error) {
        showAlert('error', 'Something went wrong');
      }
    } else {
      try {
        const results = await axiosInstance.post(
          `http://localhost:3000/topic/${topic.id}/follow`,
        );
        if (results.data === 'Success') {
          setFollow(true);
          setFollowerCount((prev) => prev + 1);
          showAlert('success', 'Following ' + topic.title);
        } else {
          showAlert('error', 'Unexpected error occurred');
        }
      } catch (error) {
        showAlert('error', 'Something went wrong');
      }
    }
  };
  useEffect(() => {
    const checkFollow = () => {
      if (topic.followers !== undefined) {
        setFollowerCount(topic.followers.length);
      }
      if (
        topic.followers?.some((follower: any) => {
          return follower.id === currentUserId
        })
      ) {
        setFollow(true);
      } else {
        setFollow(false);
      }
    };
    checkFollow();
    // eslint-disable-next-line
  }, [topic]);
  return (
    <CardContent
      sx={{
        display: 'flex',
        mb: '2%',
        backgroundColor: backgroundColor,
        borderRadius: '3px',
        transitionDelay: '3s',
        ':hover': {
          backgroundColor: backgroundColor ? '' : '#d2d4d9',
          cursor: backgroundColor ? '' : 'pointer',
        },
      }}
    >
      <CardMedia
        component="img"
        src={topic.picture?.toString() || process.env.PUBLIC_URL + '/topic_avatar.png'}
        style={{
          borderRadius: '3px',
          width: enlarge ? '150px' : '20px',
          height: enlarge ? '150px' : '20px',
          marginRight: '5%',
        }}
        alt="Topic Avatar"
      />
      <Typography
        variant="h5"
        component="div"
        overflow={'hidden'}
        display={'grid'}
      >
        <Typography
          color={enlarge ? '' : '#636466'}
          lineHeight={1.2}
          variant="inherit"
          fontSize={enlarge ? '26px' : '13px'}
          textOverflow={'ellipsis'}
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            ':hover': {
              whiteSpace: 'normal',
            },
          }}
        >
          {topic.title}
        </Typography>
        {enlarge ? (
          <Button
            color={follow ? 'inherit' : 'primary'}
            onClick={() => {
              handleSubmitFollow();
            }}
            sx={{
              position: 'relative',
              boxShadow: follow
                ? 'box-shadow: rgba(99, 100, 102, 0.2) 0px 0px 0px 1px inset;'
                : 'rgb(46, 105, 255) 0px 0px 0px 1px inset',
              backgroundColor: follow ? 'rgb(224, 226, 227)' : 'white',
              height: 'fit-content',
              width: 'fit-content',
              display: 'flex',
              justifyContent: 'space-around',
              outline: 'none',
              borderRadius: '16px',
              ':hover': {
                backgroundColor: '#ebf0ff',
              },
            }}
          >
            {follow ? (
              <BookmarkAddedOutlinedIcon />
            ) : (
              <BookmarkAddOutlinedIcon />
            )}
            <Typography
              variant="body1"
              fontSize={'13px'}
              fontWeight={'bold'}
              textTransform={'capitalize'}
            >
              {follow ? 'Following' : 'Follow'}
            </Typography>
            <Typography variant="body2" ml={'5%'}>
              {followerCount}
            </Typography>
          </Button>
        ) : null}
      </Typography>
    </CardContent>
  );
};

export default TopicCard;
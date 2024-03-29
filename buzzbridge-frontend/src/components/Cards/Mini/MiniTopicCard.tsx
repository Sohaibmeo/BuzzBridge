import React, { useEffect, useState } from 'react'
import { TopicTypes } from '../../../types/TopicTypes';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Skeleton, Typography } from '@mui/material';

const MiniTopicCard = ({loading,topic}: {
  loading: boolean;
  topic: TopicTypes;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <>
      {loaded ? (
        <CardContent>
          <Box
            onClick={() => navigate(`/topic/${topic.id}`)}
            sx={{
              display: "flex",
              width: "fit-content",
              ":hover": {
                textDecoration: "underline",
                color: "black",
              },
            }}
          >
            <Typography variant="h6" color="text.primary">
              {topic.title}
            </Typography>
          </Box>
        </CardContent>
      ) : (
        <Skeleton variant="rectangular" height={50} width={'60%'} />
      )}
    </>
  );
}

export default MiniTopicCard

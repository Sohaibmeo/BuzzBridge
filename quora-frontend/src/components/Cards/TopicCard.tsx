import { CardContent, CardMedia, Typography } from '@mui/material';
import { TopicTypes } from '../../types/TopicTypes';

const TopicCard = ({topic,backgroundColor}:{topic:TopicTypes,backgroundColor:string} ) => {
  return (
    <CardContent
      sx={{
        display: 'flex',
        width: '100%',
        padding: '10% 0 0 5%',
        borderRadius: '3px',
        ':hover': {
          backgroundColor: {backgroundColor},
          cursor: 'pointer',
        },
      }}
    >
      <CardMedia
        component="img"
        src={topic.picture?.toString()}
        style={{
          borderRadius: '3px',
          width: '20px',
          height: '20px',
          marginRight: '5%',
        }}
        alt=""
      />
      <Typography
        color={'#636466'}
        lineHeight={1.2}
        sx={{
          overflow: 'hidden !important',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ':hover': {
            textOverflow: 'inherit',
            whiteSpace: 'normal',
          },
        }}
        variant="inherit"
        fontSize={'13px'}
      >
        {topic.title}
      </Typography>
    </CardContent>
  );
};

export default TopicCard;

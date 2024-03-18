import { Box, Divider, Typography } from '@mui/material';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const CustomUpvoteDownvote = ({
  upvoted,
  downvoted,
  handleDownvote,
  handleUpvote,
  handleRemoveDownvote,
  handleRemoveUpvote,
  upvoteCount,
}: {
  upvoted: boolean;
  downvoted: boolean;
  handleDownvote: () => void;
  handleUpvote: () => void;
  handleRemoveDownvote: () => void;
  handleRemoveUpvote: () => void;
  upvoteCount: number;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'rgb(239 228 228 / 90%)',
        padding: '2%',
        columnGap: 2,
        borderRadius: '16px',
      }}
    >
      {upvoted ? (
        <ThumbUpAltIcon
          color="primary"
          onClick={() => {
            handleRemoveUpvote();
          }}
          sx={{
            fontSize: '26px',
            ':hover': { color: '#000' },
          }}
        />
      ) : (
        <ThumbUpOffAltIcon
          onClick={() => {
            handleUpvote();
          }}
          sx={{
            fontSize: '26px',
            color: '#000',
            ':hover': { color: '#1976d2' },
          }}
        />
      )}
      <Typography color="info" sx={{ fontSize: '18px' }}>
        {upvoteCount}
      </Typography>
      <Divider orientation="vertical" flexItem />
      {downvoted ? (
        <ThumbDownAltIcon
          color="error"
          onClick={() => {
            handleRemoveDownvote();
          }}
          sx={{
            fontSize: '26px',
            ':hover': { color: '#000' },
          }}
        />
      ) : (
        <ThumbDownOffAltIcon
          color="primary"
          onClick={() => {
            handleDownvote();
          }}
          sx={{
            fontSize: '26px',
            color: '#000',
            ':hover': { color: '#d32f2f' },
          }}
        />
      )}
    </Box>
  );
};

export default CustomUpvoteDownvote;

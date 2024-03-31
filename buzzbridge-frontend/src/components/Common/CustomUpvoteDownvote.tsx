import { Box, Checkbox, Divider, Typography } from "@mui/material";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const CustomUpvoteDownvote = ({
  upvoted,
  handleDownvote,
  handleUpvote,
  handleRemoveDownvote,
  handleRemoveUpvote,
  upvoteCount,
}: {
  upvoted: boolean | null;
  handleDownvote: () => void;
  handleUpvote: () => void;
  handleRemoveDownvote: () => void;
  handleRemoveUpvote: () => void;
  upvoteCount: number;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "rgb(239 228 228 / 90%)",
        padding: "2px 2px 2px 2px",
        columnGap: 1,
        borderRadius: "16px",
      }}
    >
      <Checkbox
        checked={upvoted === true}
        onChange={() => {
          if (upvoted === true) {
            handleRemoveUpvote();
          } else {
            handleUpvote();
          }
        }}
        icon={<ThumbUpOffAltIcon />}
        checkedIcon={<ThumbUpAltIcon />}
      />
      <Typography color="info" sx={{ mt: 1.3 }}>
        {upvoteCount}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Checkbox
        checked={upvoted === false}
        onChange={() => {
          if (upvoted === false) {
            handleRemoveDownvote();
          } else {
            handleDownvote();
          }
        }}
        icon={<ThumbDownOffAltIcon />}
        checkedIcon={<ThumbDownAltIcon color="error" />}
      />
    </Box>
  );
};

export default CustomUpvoteDownvote;

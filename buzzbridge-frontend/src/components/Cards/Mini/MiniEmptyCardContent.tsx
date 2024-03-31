import { CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";

const MiniEmptyCardContent = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading ? (
        <Box>
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
        </Box>
      ) : (
        <CardContent
          sx={{
            p: 2,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ManageSearchOutlinedIcon sx={{ color: "#e0e0e0", fontSize: 250 }} />
          <Typography variant="h6" color={"#6e6e6e"} gutterBottom>
            No Search Results
          </Typography>
        </CardContent>
      )}
    </>
  );
};

export default MiniEmptyCardContent;

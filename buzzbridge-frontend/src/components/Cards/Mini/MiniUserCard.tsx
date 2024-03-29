import { useEffect, useState } from "react";
import { User } from "../../../types/UserTypes";
import { useNavigate } from "react-router-dom";
import { Box, CardContent, Skeleton, Typography } from "@mui/material";

const MiniUserCard = ({ loading, user }: { loading: boolean; user: User }) => {
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
            onClick={() => navigate(`/profile/${user.id}`)}
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
              {user.name}
            </Typography>
          </Box>
        </CardContent>
      ) : (
        <Skeleton variant="rectangular" height={50} />
      )}
    </>
  );
};

export default MiniUserCard;

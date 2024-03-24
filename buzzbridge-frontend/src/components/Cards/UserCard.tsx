import { useEffect, useState } from "react";
import { User } from "../../types/UserTypes";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CreateModal from "../Modals/CreateModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UpdateUserForm from "../Forms/UpdateUserForm";
import { useUser } from "../Providers/UserProvider";

const UserCard = ({
  user,
  hover,
  width,
  height,
}: {
  user: User | null;
  hover?: boolean;
  width?: string | number;
  height?: string | number;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
  const picture = user?.picture || process.env.PUBLIC_URL + "/user_avatar.png";
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser()?.id;
  const [loading, setLoading] = useState(false);
  const displaySizeMedium = useMediaQuery("(max-width:1380px)");
  const displaySizeSmall = useMediaQuery("(max-width:500px)");
  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(true);
    }, 300);
  }, []);
  return (
    <CardContent
      sx={{
        backgroundColor: "transparent",
        boxShadow: hover ? "0 0 10px 0 rgba(0,0,0,0.1)" : "none",
        marginBottom: "2%",
        height: { height },
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          width: hover ? { width } : "100%",
          justifyContent: displaySizeMedium ? "space-around" : "center",
          alignItems: "center",
        }}
      >
        <Grid item md={2} lg={hover ? 6 : 5}>
          {picture && loading ? (
            <CardMedia
              component="img"
              src={picture?.toString()}
              alt={process.env.PUBLIC_URL + "/user_avatar.png"}
              sx={{ width: "150px", height: "150px", borderRadius: "50%" }}
              onClick={() => {
                setOpenModal(true);
              }}
            />
          ) : (
            <Skeleton
              variant="circular"
              animation={"wave"}
              width={150}
              height={150}
            />
          )}
        </Grid>
        <Grid item md={2} lg={hover ? 6 : 7}>
          <Box sx={{ ml: "3%", position: "relative" }}>
            {loading ? (
              <Typography
                variant="h4"
                fontWeight={"bolder"}
                textTransform={"capitalize"}
                fontSize={
                  hover
                    ? "1.5em"
                    : displaySizeSmall
                    ? "1.1em"
                    : displaySizeMedium
                    ? "1.325em"
                    : "2.125em"
                }
              >
                {user?.name}
              </Typography>
            ) : (
              <Skeleton variant="text" width={150} height={50} />
            )}
            {loading ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: hover
                    ? ""
                    : displaySizeSmall
                    ? "0.8em"
                    : displaySizeMedium
                    ? "0.9em"
                    : "1.0em",
                }}
              >
                {user?.email}
              </Typography>
            ) : (
              <Skeleton variant="text" width={150} height={50} />
            )}
            {user && !hover && currentUser === user.id && (
              <Button
                variant="contained"
                color="inherit"
                sx={{ mt: "5%" }}
                onClick={() => setOpenUpdateProfileModal(true)}
              >
                Edit
                <EditOutlinedIcon />
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item md={4} lg={12}>
          {loading ? (
            <Typography
              fontFamily={"cursive"}
              fontStyle={"italic"}
              sx={{ mt: "10%" }}
            >
              {user?.about
                ? '"' + user?.about + '"'
                : '"You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet.You can add a description here lorem ipsum dolor sit amet."'}
            </Typography>
          ) : (
            <Skeleton variant="text" width={200} height={50} />
          )}
        </Grid>
      </Grid>
      {openModal && (
        <CreateModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          image={true}
          Children={
            <CardMedia
              component="img"
              src={picture?.toString()}
              alt={"User Avatar"}
              style={{ width: "100%", height: "100%" }}
            />
          }
        />
      )}
      {openUpdateProfileModal && (
        <CreateModal
          openModal={openUpdateProfileModal}
          setOpenModal={setOpenUpdateProfileModal}
          Children={
            <UpdateUserForm
              user={user}
              setOpenModal={setOpenUpdateProfileModal}
            />
          }
        />
      )}
    </CardContent>
  );
};

export default UserCard;

import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import { TopicTypes } from "../../types/TopicTypes";
import { useEffect, useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../helpers/customAxios";
import CustomMoreHorizIcon from "../Custom/CustomMoreHorizIcon";
import { useUser } from "../Providers/UserProvider";

const TopicCard = ({
  topic,
  backgroundColor,
  enlarge = false,
  smallScreen = false,
}: {
  topic: TopicTypes;
  backgroundColor?: string;
  enlarge?: boolean;
  smallScreen?: boolean;
}) => {
  const [follow, setFollow] = useState(false);
  const { showAlert } = useAlert();
  const { expireCurrentUserSession, getCurrentUser } = useUser();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useCustomAxios();
  const currentUserId = getCurrentUser()?.id;
  const handleSubmitFollow = async () => {
    try {
      if (follow) {
        const results = await axiosInstance.post(`/topic/${topic.id}/unfollow`);
        if (results.data === "Success") {
          setFollow(false);
          setFollowerCount((prev) => prev - 1);
          showAlert("success", "Unfollowed " + topic.title);
        } else {
          showAlert("error", "Unexpected error occurred");
        }
      } else {
        const results = await axiosInstance.post(`/topic/${topic.id}/follow`);
        if (results.data === "Success") {
          setFollow(true);
          setFollowerCount((prev) => prev + 1);
          showAlert("success", "Following " + topic.title);
        } else {
          showAlert("error", "Unexpected error occurred");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        expireCurrentUserSession();
        showAlert("error", "You need to be logged in to do this");
      } else {
        showAlert("error", "Something went wrong");
      }
    }
  };
  useEffect(() => {
    const checkFollow = () => {
      if (topic.followers !== undefined) {
        setFollowerCount(topic.followers.length);
        if (
          topic.followers?.some((follower: any) => {
            return follower.id === currentUserId;
          })
        ) {
          setFollow(true);
        } else {
          setFollow(false);
        }
      }
    };
    checkFollow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);
  useEffect(() => {
    setLoading(true);
  }, []);
  return (
    <CardContent
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        mb: enlarge ? "2%" : smallScreen ? "1%" : "5%",
        backgroundColor: backgroundColor,
        borderRadius: "10px",
        padding: "8px !important",
        boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
        ":hover": {
          backgroundColor: backgroundColor ? "" : "#d2d4d9",
          cursor: backgroundColor ? "" : "pointer",
        },
      }}
    >
      {loading ? (
        <>
          {enlarge && (
            <Box
              position={"absolute"}
              bottom={15}
              right={15}
              display={"flex"}
              justifyContent={"space-around"}
              sx={{
                width: "fit-content",
                alignItems: "center",
                columnGap: 1,
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              <Typography variant="body2">Created by:</Typography>
              <Typography variant="body2">{topic.belongsTo?.name}</Typography>
            </Box>
          )}
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <CardMedia
          component="img"
          src={
            topic.picture?.toString() ||
            process.env.PUBLIC_URL + "/topic_avatar.png"
          }
          style={{
            borderRadius: "3px",
            width: enlarge ? "150px" : "20px",
            height: enlarge ? "150px" : "20px",
            marginRight: "5%",
          }}
          alt="Topic Avatar"
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width={enlarge ? 150 : 20}
          height={enlarge ? 150 : 20}
        />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box overflow={"hidden"} display={"grid"}>
          {loading ? (
            <Typography
              color={enlarge ? "" : "#636466"}
              lineHeight={1.2}
              variant="inherit"
              fontSize={enlarge ? "24px" : "13px"}
              textOverflow={"ellipsis"}
              sx={{
                overflow: enlarge ? "" : "hidden",
                whiteSpace: enlarge ? "" : "nowrap",
                mb: enlarge ? "5%" : "0",
              }}
            >
              {topic.title}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ ml: "5%" }}
              width={enlarge ? 120 : 100}
              height={enlarge ? 50 : 30}
            />
          )}
          {enlarge && loading ? (
            <Button
              color={follow ? "inherit" : "primary"}
              onClick={() => {
                handleSubmitFollow();
              }}
              sx={{
                position: "relative",
                boxShadow: follow
                  ? "box-shadow: rgba(99, 100, 102, 0.2) 0px 0px 0px 1px inset"
                  : "rgb(46, 105, 255) 0px 0px 0px 1px inset",
                backgroundColor: follow ? "rgb(224, 226, 227)" : "white",
                height: "fit-content",
                width: "fit-content",
                display: "flex",
                justifyContent: "space-around",
                borderRadius: "16px",
                ":hover": {
                  backgroundColor: "#ebf0ff",
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
                fontSize={"13px"}
                fontWeight={"bold"}
                textTransform={"capitalize"}
              >
                {follow ? "Following" : "Follow"}
              </Typography>
              <Typography variant="body2" ml={"5%"}>
                {followerCount}
              </Typography>
            </Button>
          ) : (
            enlarge && (
              <Skeleton
                sx={{ ml: "5%", mt: "5%" }}
                variant="rectangular"
                width={100}
                height={40}
              />
            )
          )}
        </Box>
        {enlarge && (
          <CustomMoreHorizIcon
            id={topic.id}
            type={"topic"}
            defaultFormValues={topic}
          />
        )}
      </Box>
    </CardContent>
  );
};

export default TopicCard;

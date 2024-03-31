import React, { useEffect, useState } from "react";
import { TopicTypes } from "../../../types/TopicTypes";
import { useNavigate } from "react-router-dom";
import { Box, CardContent, Divider, Skeleton, Typography } from "@mui/material";
import { QuestionType } from "../../../types/QuestionTypes";
import { User } from "../../../types/UserTypes";

const MiniCard = ({
  loading,
  data,
  currentTab,
  setOpenModal,
}: {
  loading: boolean;
  data: User | QuestionType | TopicTypes;
  currentTab: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleClick = () => {
    if (currentTab === "questions") {
      navigate(`/question/${data.id}`);
    } else if (currentTab === "topics") {
      navigate(`/topic/${data.id}`);
    } else {
      navigate(`/profile/${data.id}`);
    }
    if (setOpenModal) {
      setOpenModal(false);
    }
  };
  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <>
      {loaded ? (
        <CardContent
          onClick={handleClick}
          sx={{
            backgroundColor: "white",
            mb: "5px",
            borderRadius: "16px",
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
            height: "fit-content",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              gap: 3,
              ":hover": {
                textDecoration: "underline",
                color: "black",
              },
            }}
          >
            <Typography variant="h6" color="text.primary">
              {"title" in data ? data.title : data.name}
            </Typography>
            <Box display={"flex"} gap={1}>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" color="text.primary">
                By: {"title" in data ? data.belongsTo?.name : data.email}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      ) : (
        <Skeleton variant="rectangular" height={50} width={"60%"} />
      )}
    </>
  );
};

export default MiniCard;

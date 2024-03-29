import React, { useEffect, useState } from "react";
import { QuestionType } from "../../../types/QuestionTypes";
import { Box, CardContent, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MiniQuestionCard = ({
  question,
  loading,
}: {
  question: QuestionType;
  loading: boolean;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log("Making it here")
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
            onClick={() => navigate(`/question/${question.id}`)}
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
              {question.title}
            </Typography>
          </Box>
        </CardContent>
      ) : (
        <Skeleton variant="rectangular" height={50} />
      )}
    </>
  );
};

export default MiniQuestionCard;

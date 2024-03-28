import { useEffect, useState } from "react";
import { QuestionType } from "../types/QuestionTypes";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdvertisementCard from "../components/Cards/AdvertisementCard";
import QuestionCard from "../components/Cards/QuestionCard";
import useCustomAxios from "../helpers/customAxios";
import { useAlert } from "../components/Providers/AlertProvider";

const Question = () => {
  const [question, setQuestion] = useState<QuestionType>({
    id: 0,
    title: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const axiosInstance = useCustomAxios();
  const { showAlert } = useAlert();
  let { id } = useParams();
  const navigate = useNavigate();
  async function getQuestionId() {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/question/${id}`);
      setQuestion(response.data);
    } catch (error) {
      console.log(error);
      navigate("/");
      showAlert("error", "Question not found");
    }
    setLoading(false);
  }
  useEffect(() => {
    if (id) {
      getQuestionId();
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <>
      <Grid container columnGap={2} justifyContent={"center"} sx={{ mt: "2%" }}>
        <Grid
          item
          xs={1}
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
          sx={{
            position: "sticky",
            top: "10%",
            height: "fit-content",
            justifyContent: "end",
            borderRadius: "3px",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </Button>
        </Grid>
        <Grid
          item
          lg={4.5}
          xs={12}
          sx={{ backgroundColor: "white", marginBottom: "10rem" }}
        >
          <QuestionCard
            question={question}
            displayAnswers
            enrich
            setQuestion={setQuestion}
            loading={loading}
          />
        </Grid>
        <Grid
          item
          xs={3.5}
          display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
        >
          <AdvertisementCard />
        </Grid>
      </Grid>
    </>
  );
};

export default Question;

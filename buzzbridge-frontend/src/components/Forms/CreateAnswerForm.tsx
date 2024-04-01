import {
  Container,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import { useNavigate } from "react-router-dom";
import { CreateAnswer } from "../../types/AnswerTypes";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useUser } from "../Providers/UserProvider";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";

const CreateAnswerForm = ({
  questionId,
  setAnswers,
}: {
  questionId: number;
  setAnswers: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [formData, setFormData] = useState<CreateAnswer>({
    description: null,
    question: questionId,
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession, getCurrentUser } = useUser();
  const user = getCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/answer/", {
        ...formData,
        question: questionId,
      });
      setFormData({ question: questionId, description: null });
      console.log(response);
      setSuccess(true);
      setLoading(false);
      showAlert("success", "Answer Posted");
      setAnswers((prev: any) => [{...response.data, belongsTo: user}, ...prev]);
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert(
        "error",
        error.response?.data?.message || error.message || "An error occured"
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        navigate("/login");
      }
    }
  };
  return (
    <Container maxWidth="md">
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom></Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <InputBase
                required
                maxRows={10}
                multiline
                value={formData.description || ""}
                style={{
                  width: "85%",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  border: "none",
                  padding: "3%",
                }}
                placeholder="Write Something..."
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <CustomLoadingButton
                loading={loading}
                success={success}
                Icon={<ArrowForward />}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default CreateAnswerForm;

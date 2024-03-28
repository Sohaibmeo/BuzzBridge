import {
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import { CreateQuestion } from "../../types/QuestionTypes";
import { TopicTypes } from "../../types/TopicTypes";
import { useNavigate } from "react-router-dom";
import useCustomAxios from "../../utils/helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import { useUser } from "../Providers/UserProvider";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuestionSchema } from "../..//utils/schema/questionSchema";

const CreateQuestionForm = ({
  setOpenCreateQuestionModal,
}: {
  setOpenCreateQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { expireCurrentUserSession } = useUser();
  const [formData, setFormData] = useState<CreateQuestion>({
    title: "",
    assignedTopics: [],
  });
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleData = async (e: any) => {
    console.log("handleData");
    setLoading(true);
    try {
      const { picture } = formData;
      let body = { ...formData };
      if (picture) {
        const responseImage = await axiosInstance.post(
          "/auth/imagekit/getImageUrl",
          { file: picture },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        body = {
          ...formData,
          picture: responseImage?.data?.url || null,
          fileId: responseImage?.data?.fileId || null,
        };
      }

      const response = await axiosInstance.post("/question/", body);
      if (response.status === 201 && response.data === "Succesful") {
        showAlert("success", "Question Created");
        setOpenCreateQuestionModal(false);
        setLoading(false);
        setSuccess(true);
        navigate(0);
      } else {
        setLoading(false);
        setSuccess(false);
        throw new Error("Failed to create question (UNEXCPECTED ERROR)");
      }
    } catch (error: any) {
      showAlert(
        "error",
        error.response.status + " " + error.response.statusText
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateQuestionModal(false);
      }
      setLoading(false);
      setSuccess(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/topic/");
        setTopics(response.data);
      } catch (error: any) {
        showAlert("error", error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateQuestion>({
    resolver: zodResolver(CreateQuestionSchema),
    defaultValues: {
      assignedTopics: [],
    },
    mode: "onChange",
  });
  return (
    <Container maxWidth="md">
      <div
        style={{
          marginTop: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Question
        </Typography>
        {formData?.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{ mb: 2, height: "400px", width: "100%" }}
          />
        )}
        <form onSubmit={handleSubmit(handleData)} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                {...register("title")}
                fullWidth
                multiline
                maxRows={16}
                label="Question"
                name="title"
                onBlur={handleChange}
                helperText={errors.title?.message}
                error={Boolean(errors.title?.message)}
              />
            </Grid>
            <Grid item lg={8} xs={12}>
              <FormLabel htmlFor="select-multiple-chip">Topics</FormLabel>
              <Select
                {...register("assignedTopics")}
                fullWidth
                labelId="multi-select-topics"
                multiple
                open={open}
                onClose={()=>{setOpen(false)}}
                onOpen={()=>{setOpen(true)}}
                id="tags-outlined"
                defaultValue={[]}
                onChange={(e: any) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignedTopics: e.target.value,
                  }));
                  setOpen(false);
                }}
                error={Boolean(errors.assignedTopics?.message)}
                variant="outlined"
                label="Topics"
                placeholder="Select Topics"
                input={<OutlinedInput id="select-multiple-chip" />}
                inputProps={{
                  label: "Topics",
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      return (
                        <Chip
                          key={value}
                          label={
                            topics.find((topic) => topic.id === value)?.title
                          }
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={Boolean(errors.assignedTopics?.message)}>
                {errors.assignedTopics?.message}
              </FormHelperText>
            </Grid>
            <Grid item lg={4} xs={12} display={"flex"} alignItems={"center"} mt={'1.4%'}>
              <CustomImgUpload setFormData={setFormData} height={'45px'} />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              mt: "3%",
              columnGap: 1,
            }}
          >
            <CustomLoadingButton loading={loading} success={success} />
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateQuestionModal(false)}
            >
              Close
            </Button>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default CreateQuestionForm;

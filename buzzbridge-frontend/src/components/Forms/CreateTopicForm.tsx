import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CreateTopic, TopicTypes } from "../../types/TopicTypes";
import { useAlert } from "../Providers/AlertProvider";

import useCustomAxios from "../../utils/helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import { useUser } from "../Providers/UserProvider";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopicSchema } from "../../utils/schema/topicSchema";

const CreateTopicForm = ({
  setOpenCreateTopicModal,
  setTopics,
}: {
  setOpenCreateTopicModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTopics: React.Dispatch<React.SetStateAction<TopicTypes[]>>;
}) => {
  const [formData, setFormData] = useState<CreateTopic>({
    title: "",
  });
  // eslint-disable-next-line
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleData = async (e: any) => {
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
          ...body,
          picture: responseImage?.data?.url,
          fileId: responseImage?.data?.fileId,
        };
      }
      const response = await axiosInstance.post("/topic", body);
      showAlert("success", "Topic Created");
      setSuccess(true);
      setOpenCreateTopicModal(false);
      setTopics((prev) => [response.data, ...prev]);
      setLoading(false);
    } catch (error: any) {
      showAlert(
        "error",
        error.response?.data?.message || error.message || "An error occured"
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateTopicModal(false);
      }
      setSuccess(false);
      setLoading(false);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateTopic>({
    resolver: zodResolver(TopicSchema),
  });
  return (
    <Container maxWidth="md">
      <Box
        style={{
          marginTop: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Topic
        </Typography>
        {formData.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{ mb: 2, height: "200px", width: "200px" }}
          />
        )}
        <form onSubmit={handleSubmit(handleData)} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register("title")}
                error={Boolean(errors.title?.message)}
                variant="outlined"
                fullWidth
                label="Title"
                name="title"
                onBlur={handleChange}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item lg={8} xs={12}>
              <TextField
                variant="outlined"
                {...register("description")}
                error={Boolean(errors.description?.message)}
                multiline
                fullWidth
                maxRows={19}
                label="Description"
                name="description"
                onBlur={handleChange}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item lg={4} xs={12} display={"flex"} alignItems={"center"}>
              <CustomImgUpload
                setFormData={setFormData}
                onlyImage
                customText="Image"
                height={'48px'}
                width={'100%'}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              columnGap: 1,
              mt: "3%",
            }}
          >
            <CustomLoadingButton loading={loading} success={success} />
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateTopicModal(false)}
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTopicForm;

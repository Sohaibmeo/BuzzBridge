import { useEffect, useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import { Box, Button, CardMedia, TextField } from "@mui/material";
import CustomImgUpload from "../Custom/CustomImgUpload";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useUser } from "../Providers/UserProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateQuestionSchema } from "../../utils/schema/questionSchema";
import { QuestionType, UpdateQuestion } from "../../types/QuestionTypes";
import { isVideo } from "../../utils/helpers/checkVideo";

const UpdateQuestionForm = ({
  id,
  defaultFormValues,
  setOpenModal,
  setQuestions,
  setQuestion,
}: {
  id: number;
  defaultFormValues: any;
  setOpenModal: any;
  setQuestions?: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setQuestion?: React.Dispatch<React.SetStateAction<QuestionType>>;
}) => {
  const [formData, setFormData] = useState<UpdateQuestion>({});
  const [loading, setLoading] = useState(false);
  const [mediaTypeVideo, setMediaTypeVideo] = useState<boolean>(
    isVideo(defaultFormValues.picture)
  );
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const handleChange = async (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const { picture } = formData;
      let body = { ...formData };
      if (picture) {
        const responseImage = await axiosInstance.post(
          "/image/imagekit/getImageUrl",
          { file: picture },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (defaultFormValues.picture) {
          await axiosInstance.delete(
            `/image/imagekit?url=${defaultFormValues.picture}&fileId=${defaultFormValues.fileId}`
          );
        }
        body = {
          ...body,
          picture: responseImage?.data?.url,
          fileId: responseImage?.data?.fileId,
        };
      }

      await axiosInstance.patch(`/question/${id}`, body);
      showAlert("success", "Question updated successfully");
      setLoading(false);
      setSuccess(true);
      setOpenModal(false);
      if (setQuestions) {
        setQuestions((prev: any) =>
          prev.map((question: any) =>
            question.id === id ? { ...question, ...body } : question
          )
        );
      } else if (setQuestion) {
        setQuestion((prev: any) => ({ ...prev, ...body }));
      }
    } catch (error: any) {
      showAlert("error", "Error updating user");
      setLoading(false);
      setSuccess(false);
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };

  useEffect(() => {
    if(formData.picture){
      const isVideo = formData.picture.type.startsWith("video/");
      if (isVideo) {
        setMediaTypeVideo(true);
      } else {
        setMediaTypeVideo(false);
      }
    }
  }, [formData.picture]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateQuestion>({
    resolver: zodResolver(UpdateQuestionSchema),
  });
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {defaultFormValues.picture || formData?.picture ? (
        <Box display={"flex"} alignItems={"center"} columnGap={3}>
          <CustomImgUpload
            setFormData={setFormData}
            height={"100%"}
            hover
            customText=" "
            children={
              <CardMedia
                component={mediaTypeVideo ? "video" : "img"}
                height="400"
                image={
                  defaultFormValues.picture ||
                  (formData.picture && URL.createObjectURL(formData?.picture))
                }
                alt="green iguana"
              />
            }
          />
        </Box>
      ) : (
        <CustomImgUpload
          setFormData={setFormData}
          height={"100%"}
          width={"fit-content"}
        />
      )}
      <TextField
        {...register("title")}
        error={Boolean(errors.title?.message)}
        helperText={errors.title?.message}
        label="Title"
        name="title"
        variant="outlined"
        defaultValue={defaultFormValues.title}
        fullWidth
        margin="normal"
        onBlur={handleChange}
      />
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
          onClick={() => setOpenModal(false)}
          sx={{ mt: 1.1 }}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateQuestionForm;

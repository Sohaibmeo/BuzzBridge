import { Box, Button, CardMedia, TextField } from "@mui/material";
import { useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useUser } from "../Providers/UserProvider";
import { TopicTypes, UpdateTopic } from "../../types/TopicTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTopicSchema } from "../../utils/schema/topicSchema";

const UpdateTopicForm = ({
  id,
  defaultFormValues,
  setOpenModal,
  setTopics,
  setTopic,
}: {
  id: number;
  defaultFormValues: any;
  setOpenModal: any;
  setTopics?: React.Dispatch<React.SetStateAction<TopicTypes[]>>;
  setTopic?: React.Dispatch<React.SetStateAction<TopicTypes>>;
}) => {
  const [formData, setFormData] = useState<UpdateTopic>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const { expireCurrentUserSession } = useUser();
  const axiosInstance = useCustomAxios();
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
          "/auth/imagekit/getImageUrl",
          { file: picture },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (defaultFormValues.picture) {
          await axiosInstance.delete(
            `/auth/imagekit?url=${defaultFormValues.picture}&fileId=${defaultFormValues.fileId}`
          );
        }
        body = {
          ...body,
          picture: responseImage?.data?.url,
          fileId: responseImage?.data?.fileId || null,
        };
      }
      await axiosInstance.patch(`/topic/${id}`, body);
      showAlert("success", "Topic updated successfully");
      setLoading(false);
      setSuccess(true);
      setOpenModal(false);
      if(setTopics){
        setTopics((prev: any) =>
          prev.map((topic: any) =>
            topic.id === id ? { ...topic, ...body } : topic
          )
        );
      }else if (setTopic) {
        setTopic((prev: any) => ({ ...prev, ...body }));
      }
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert("error", error?.response?.data?.message);
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTopic>({
    resolver: zodResolver(UpdateTopicSchema),
  });
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {defaultFormValues.picture || formData.picture ? (
        <Box display={"flex"} alignItems={"center"} columnGap={3}>
          <CustomImgUpload
            setFormData={setFormData}
            height={"100%"}
            hover
            customText=" "
            onlyImage
            children={
              <CardMedia
                component="img"
                height="400"
                image={
                  formData.picture
                    ? URL.createObjectURL(formData?.picture)
                    : defaultFormValues.picture
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
          onlyImage
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
      <TextField
        {...register("description")}
        error={Boolean(errors.description?.message)}
        helperText={errors.description?.message}
        label="Description"
        name="description"
        variant="outlined"
        defaultValue={defaultFormValues.description}
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
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateTopicForm;

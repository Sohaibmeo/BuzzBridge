import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import useCustomAxios from '../../helpers/customAxios';
import { Box, Button, CardMedia, TextField } from '@mui/material';
import CustomImgUpload from '../Custom/CustomImgUpload';
import CustomLoadingButton from '../Custom/CustomLoadingButton';
import { useUser } from '../Providers/UserProvider';

const UpdateQuestionForm = ({
  id,
  defaultFormValues,
  setOpenModal,
}: {
  id: number;
  defaultFormValues: any;
  setOpenModal: any;
}) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const handleChange = async (e: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { picture, ...rest } = formData;
      const responseImage = formData.picture
        ? await axiosInstance.post(
            '/auth/imagekit/getImageUrl',
            { file: picture },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        : defaultFormValues.picture;
      if (!formData.picture && defaultFormValues.picture) {
        await axiosInstance.delete(
          `/auth/imagekit?url=${defaultFormValues.picture}&fileId=${defaultFormValues.fileId}`,
        );
      }
      await axiosInstance.patch(`/question/${id}`, {
        ...rest,
        picture: responseImage?.data?.url || responseImage,
        fileId: responseImage?.data?.fileId || null,
      });
      showAlert('success', 'Question updated successfully');
      setLoading(false);
      setSuccess(true);
    } catch (error: any) {
      showAlert('error', 'Error updating user');
      setLoading(false);
      setSuccess(false);
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      {defaultFormValues.picture ? (
        <Box display={'flex'} alignItems={'center'} columnGap={3}>
          <CustomImgUpload
            setFormData={setFormData}
            height={'100%'}
            hover
            customText=" "
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
          height={'100%'}
          width={'fit-content'}
        />
      )}
      <TextField
        label="Titles"
        name="title"
        variant="outlined"
        defaultValue={defaultFormValues.title}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          columnGap: 1,
          mt: '3%',
        }}
      >
        <CustomLoadingButton
          loading={loading}
          success={success}
          handleSubmit={handleFormSubmit}
        />
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

export default UpdateQuestionForm;

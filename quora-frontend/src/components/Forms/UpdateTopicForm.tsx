import { Box, Button, CardMedia, TextField } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import customAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import CustomLoadingButton from '../Custom/CustomLoadingButton';
import { useUser } from '../Providers/UserProvider';

const UpdateTopicForm = ({
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
  const { expireCurrentUserSession } = useUser();
  const axiosInstance = customAxios();
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
          `/auth/imageki?url=${defaultFormValues.picture}&fieldId=${defaultFormValues.fileId}`,
        );
      }
      await axiosInstance.patch(`/topic/${id}`, {
        ...rest,
        picture: responseImage?.data?.url,
        fileId: responseImage?.data?.fileId || null,
      });
      showAlert('success', 'Topic updated successfully');
      setLoading(false);
      setSuccess(true);
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert('error', 'Error updating user');
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
        label="Title"
        name="title"
        variant="outlined"
        defaultValue={defaultFormValues.title}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <TextField
        label="Description"
        name="description"
        variant="outlined"
        defaultValue={defaultFormValues.description}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
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

export default UpdateTopicForm;

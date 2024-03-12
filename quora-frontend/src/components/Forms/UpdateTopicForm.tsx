import { Box, Button, CardMedia, TextField } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import customAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';

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
  const { showAlert } = useAlert();
  const axiosInstance = customAxios();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await axiosInstance.patch(`/topic/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showAlert('success', 'Answer updated successfully');
    } catch (error) {
      showAlert('error', 'Error updating user');
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
                image={formData.picture || defaultFormValues.picture}
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
          columnGap: 1,
          mt: '3%',
        }}
      >
        <Button variant="contained" color="primary" type="submit">
          Update
        </Button>
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

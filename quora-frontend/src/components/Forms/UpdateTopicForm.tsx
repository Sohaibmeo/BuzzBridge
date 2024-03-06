import { Box, Button, CardMedia, TextField } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import useCustomAxios from '../../helpers/customAxios';

const UpdateTopicForm = ({
  id,
  defaultFormValues,
  setOpenModal,
}: {
  id: number;
  defaultFormValues: any;
  setOpenModal: any;
}) => {
  const [formData, setFormData] = useState({});
  const { showAlert } = useAlert();
  const customAxios = useCustomAxios();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await customAxios.patch(`/topic/${id}`, formData);
      showAlert('success', 'Answer updated successfully');
    } catch (error) {
      showAlert('error', 'Error updating user');
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      {defaultFormValues.picture && (
        <CardMedia
          component="img"
          height="400"
          image={defaultFormValues.picture}
          alt="green iguana"
        />
      )}
      <TextField
        label="Picture"
        name="picture"
        variant="outlined"
        defaultValue={defaultFormValues.picture}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
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

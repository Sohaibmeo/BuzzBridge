import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import customAxios from '../../helpers/customAxios';
import { useUser } from '../Providers/UserProvider';

const UpdateAnswerForm = ({
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
  const axiosInstance = customAxios();
  const { expireCurrentUserSession } = useUser();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await axiosInstance.patch(`/answer/${id}`, formData);
      showAlert('success', 'Answer updated successfully');
    } catch (error: any) {
      showAlert('error', 'Error updating user');
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
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

export default UpdateAnswerForm;

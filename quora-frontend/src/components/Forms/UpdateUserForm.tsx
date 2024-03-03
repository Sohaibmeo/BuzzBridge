import { Box, Button, CardMedia, TextField } from '@mui/material';
import { useState } from 'react';
import { UpdateUser, User } from '../../types/UserTypes';
import { useAlert } from '../Providers/AlertProvider';
import useCustomAxios from '../../helpers/customAxios';

const UpdateUserForm = ({
  user,
  setOpenModal,
}: {
  user: User | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const picture =
    user?.picture?.toString() || process.env.PUBLIC_URL + '/user_avatar.png';
  const [formData, setFormData] = useState<UpdateUser>({});
  const { showAlert } = useAlert();
  const customAxios = useCustomAxios();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await customAxios.patch(`/user/${user?.id}`, formData);
      showAlert('success', 'User updated successfully');
    } catch (error) {
      showAlert('error', 'Error updating user');
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: '3%',
        }}
      >
        <CardMedia
          component="img"
          src={picture}
          alt={user?.name}
          sx={{
            height: '200px',
            width: '200px',
            borderRadius: '50%',
          }}
        />
      </Box>
      <TextField
        label="Picture"
        name="picture"
        variant="outlined"
        defaultValue={user?.picture}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        defaultValue={user?.name}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <TextField
        label="Email"
        name="email"
        variant="outlined"
        defaultValue={user?.email}
        fullWidth
        margin="normal"
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <TextField
        label="About"
        name="about"
        variant="outlined"
        defaultValue={user?.about}
        multiline
        maxRows={6}
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
          sx={{ marginLeft: '1%' }}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateUserForm;

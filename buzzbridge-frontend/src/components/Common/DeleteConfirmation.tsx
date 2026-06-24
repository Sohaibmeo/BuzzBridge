import { Box, Button, Stack, Typography } from '@mui/material';
import useCustomAxios from '../../utils/helpers/customAxios';
import { useAlert } from '../Providers/AlertProvider';
import { useNavigate } from 'react-router-dom';

const DeleteConfirmation = ({
  id,
  picture,
  fieldId,
  type,
  setOpenModal,
  setData,
}: {
  id: number;
  picture: string;
  fieldId: string;
  type: string;
  setOpenModal: (value: boolean) => void;
  setData: any;
}) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const handleDelete = async () => {
    setOpenModal(false);
    try {
      if (picture) {
        await axiosInstance.delete(
          `/image/imagekit?url=${picture}&fileId=${fieldId}`,
        );
      }
      await axiosInstance.delete(`${type}/${id}`);
      showAlert('success', `${type} deleted successfully`);
      if (setData) {
        setData((prev: any) => prev.filter((item: any) => item.id !== id));
      } else {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ pt: 2, pr: { xs: 0, sm: 2 } }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          pr: { xs: 0, sm: 3 },
          lineHeight: 1.4,
        }}
      >
          Are you sure you want to delete this {type} ?
      </Typography>
      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default DeleteConfirmation;

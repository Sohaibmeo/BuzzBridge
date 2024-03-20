import { Button, Container, Typography } from '@mui/material';
import useCustomAxios from '../../helpers/customAxios';
import { useAlert } from '../Providers/AlertProvider';
import { useNavigate } from 'react-router-dom';

const DeleteConfirmation = ({
  id,
  picture,
  fieldId,
  type,
  setOpenModal,
}: {
  id: number;
  picture: string;
  fieldId: string;
  type: string;
  setOpenModal: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const handleDelete = async () => {
    try {
      if(picture){
        await axiosInstance.delete(`/auth/imagekit?url=${picture}&fileId=${fieldId}`);
      }
      await axiosInstance.delete(`${type}/${id}`);
      showAlert('success', `${type} deleted successfully`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
    setOpenModal(false);
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1" fontWeight={'Bold'}>
        Are you sure you want to delete this {type}
      </Typography>
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
    </Container>
  );
};

export default DeleteConfirmation;

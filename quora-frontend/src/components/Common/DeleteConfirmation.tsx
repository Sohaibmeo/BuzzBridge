import { Button, Container } from '@mui/material';
import useCustomAxios from '../../helpers/customAxios';

const DeleteConfirmation = ({
  id,
  type,
  setOpenModal,
}: {
  id: number;
  type: string;
  setOpenModal: (value: boolean) => void;
}) => {
  const axiosInstance = useCustomAxios();
  const handleDelete = async () => {
    await axiosInstance.delete(`${type}/${id}`);
    setOpenModal(false);
  };
  return (
    <Container maxWidth="sm" sx={{ display: 'flex' }}>
      <div>Are you sure you want to delete this {type}</div>
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={() => setOpenModal(false)}>Cancel</Button>
    </Container>
  );
};

export default DeleteConfirmation;

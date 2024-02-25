import { Box, Modal } from '@mui/material';
import './style.css'

const CreateModal = ({
  openModal,
  setOpenModal,
  image = false,
  Children,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  image?: boolean;
  Children: React.ReactNode;
}) => {
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box className={image? 'modalImage' : 'modalBox'} sx={{ width: 700 }}>
        {Children}
      </Box>
    </Modal>
  );
};

export default CreateModal;

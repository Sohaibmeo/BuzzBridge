import { Box, Modal } from '@mui/material';
import './style.css'

const CreateModal = ({
  openModal,
  setOpenModal,
  image = false,
  Children,
  width = 700,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  image?: boolean;
  Children: React.ReactNode;
  width?: number | string;
}) => {
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box className={image? 'modalImage' : 'modalBox'} sx={{ width: {width} }}>
        {Children}
      </Box>
    </Modal>
  );
};

export default CreateModal;

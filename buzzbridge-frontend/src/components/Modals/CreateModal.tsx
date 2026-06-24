import { Box, Modal, useMediaQuery } from '@mui/material';
import './style.css';
import CustomCloseIcon from '../Custom/CustomCloseIcon';

const CreateModal = ({
  openModal,
  setOpenModal,
  image = false,
  disableBackDrop = false,
  Children,
  width = 600,
  height = 'auto',
  backgroundColor,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  image?: boolean;
  disableBackDrop?: boolean;
  Children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
}) => {
  const handleClose = () => {
    if (disableBackDrop) return;
    setOpenModal(false);
  };
  const displaySizeLarge = useMediaQuery('(max-width:900px)');
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        className={image ? 'modalImage' : 'modalBox'}
        sx={{
          width: displaySizeLarge ? 'calc(100vw - 32px)' : width,
          maxWidth: 'calc(100vw - 32px)',
          backgroundColor: backgroundColor || 'background.paper',
          maxHeight: 'calc(100vh - 48px)',
          height,
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.28)',
          p: { xs: 2.5, sm: 4 },
          borderRadius: '18px',
          outline: 'none',
        }}
      >
        <CustomCloseIcon setOpenModal={setOpenModal} />
        {Children}
      </Box>
    </Modal>
  );
};

export default CreateModal;

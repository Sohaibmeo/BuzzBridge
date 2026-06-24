import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomCloseIcon = ({
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
}) => {
  return (
    <IconButton
      aria-label="Close"
      onClick={() => setOpenModal(false)}
      sx={{
        position: 'absolute',
        right: 12,
        top: 12,
        color: 'text.secondary',
        zIndex: 2,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CustomCloseIcon;

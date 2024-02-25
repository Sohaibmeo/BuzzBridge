import { Box, Modal } from '@mui/material';
import CreateTopicForm from '../Forms/CreateTopicForm';
import './style.css';

const CreateTopicModal = ({
  openCreateTopicModal,
  setOpenCreateTopicModal,
}: {
  openCreateTopicModal: boolean;
  setOpenCreateTopicModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      open={openCreateTopicModal}
      onClose={() => setOpenCreateTopicModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box className="modalBox" sx={{ width: 700 }}>
        <CreateTopicForm setOpenCreateTopicModal={setOpenCreateTopicModal} />
      </Box>
    </Modal>
  );
};

export default CreateTopicModal;

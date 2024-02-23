import { Box, Modal } from '@mui/material'
import CreateTopicForm from '../Forms/CreateTopicForm'
import './style.css'

const CreateQuestionModal = ({openCreateQuestionModal,setOpenCreateQuestionModal}:
  {
    openCreateQuestionModal:boolean,
    setOpenCreateQuestionModal:React.Dispatch<React.SetStateAction<boolean>>,
  }) => {
  return (
    <Modal
      open={openCreateQuestionModal}
      onClose={()=>setOpenCreateQuestionModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
    <Box className="modalBox">
        <CreateTopicForm />
    </Box>
    </Modal>
  )
}

export default CreateQuestionModal
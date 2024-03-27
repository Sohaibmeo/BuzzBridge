import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import CreateModal from '../Modals/CreateModal';
import DeleteConfirmation from '../Common/DeleteConfirmation';
import GeneralUpdateForm from '../Common/GeneralUpdateForm';
import { useUser } from '../Providers/UserProvider';
const CustomMoreHorizIcon = ({
  id,
  type,
  defaultFormValues,
  setData,
  setSingleData,
}: {
  id: number;
  type: string;
  defaultFormValues: any;
  setData: any;
  setSingleData: any;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser()?.id;
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenMoreMenu = async (option: string) => {
    switch (option) {
      case 'Edit':
        setOpenEditModal(true);
        break;
      case 'Delete':
        setOpenDeleteModal(true);
        break;
      case 'Report':
        console.log('Report');
        break;
      case 'Share':
        console.log('Share');
        break;
      default:
        console.log('Nothing');
    }
    handleClose();
  };
  const menuOptions = ['Edit', 'Delete', 'Report', 'Share'];

  return (
    <>
      <Box position={'relative'}>
        <MoreHorizIcon
          id="basic-icon"
          color="inherit"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            borderRadius: '50%',
            padding: '0.5rem',
            color: 'rgba(0, 0, 0, 0.6)',
          }}
          onClick={(e) => handleClick(e)}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-icon',
          }}
        >
          {menuOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleOpenMoreMenu(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      {openDeleteModal && currentUser === defaultFormValues.belongsTo.id && (
        <CreateModal
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          Children={
            <DeleteConfirmation
              id={id}
              picture={defaultFormValues.picture}
              fieldId={defaultFormValues.fileId}
              type={type}
              setOpenModal={setOpenDeleteModal}
              setData={setData}
            />
          }
        />
      )}
      {openEditModal && currentUser === defaultFormValues.belongsTo.id && (
        <CreateModal
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          Children={
            <GeneralUpdateForm
              id={id}
              type={type}
              defaultFormValues={defaultFormValues}
              setOpenModal={setOpenEditModal}
              setData={setData}
              setSingleData={setSingleData}
            />
          }
        />
      )}
    </>
  );
};

export default CustomMoreHorizIcon;

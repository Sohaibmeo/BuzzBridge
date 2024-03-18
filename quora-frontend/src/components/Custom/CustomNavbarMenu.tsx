import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Providers/UserProvider';

const MenuNavbarDesktop = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
}) => {
  const { currentUser, handleCurrentUserLogout } = useUser();

  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(`/profile/${currentUser?.id}`);
        }}
        sx={{ display: 'flex', columnGap: 1, justifyContent: 'left' }}
      >
        <AccountCircle fontSize="small" />
        <Typography variant="body1">Profile</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate('/account');
        }}
        sx={{ display: 'flex', columnGap: 1, justifyContent: 'left' }}
      >
        <Settings fontSize="small" />
        <Typography variant="body1">Settings</Typography>
      </MenuItem>
      <MenuItem
        sx={{ display: 'flex', columnGap: 1, justifyContent: 'left' }}
        onClick={() => {
          handleMenuClose();
          handleCurrentUserLogout();
        }}
      >
        <Logout fontSize="small" />
        <Typography variant="body1">Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MenuNavbarDesktop;

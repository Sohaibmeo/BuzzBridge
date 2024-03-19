import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Providers/UserProvider";

const MenuNavbarDesktop = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
}) => {
  const { getCurrentUser, handleCurrentUserLogout } = useUser();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      sx={{ padding: 0 }}
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
        sx={{
          display: "flex",
          columnGap: 1,
          justifyContent: "left",
          padding: "20px 40px 20px 40px",
        }}
      >
        <AccountCircle fontSize="small" />
        <Typography variant="body1">Profile</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/account");
        }}
        sx={{
          display: "flex",
          columnGap: 1,
          justifyContent: "left",
          padding: "20px 40px 20px 40px",
        }}
      >
        <Settings fontSize="small" />
        <Typography variant="body1">Settings</Typography>
      </MenuItem>
      <MenuItem
        sx={{
          display: "flex",
          columnGap: 1,
          justifyContent: "left",
          padding: "20px 40px 20px 40px",
        }}
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

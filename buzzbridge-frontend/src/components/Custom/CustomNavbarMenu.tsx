import { Menu } from "@mui/material";
import ProfileSettingsItems from "./ProfileSettingsItems";

const MenuNavbarDesktop = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
}) => {
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
      <ProfileSettingsItems handleMenuClose={handleMenuClose} />
    </Menu>
  );
};

export default MenuNavbarDesktop;

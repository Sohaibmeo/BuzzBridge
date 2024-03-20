import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { CardMedia, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Providers/UserProvider";

const ProfileSettingsItems = ({
  handleMenuClose,
  insideDrawer,
}: {
  handleMenuClose: () => void;
  insideDrawer?: boolean;
}) => {
  const menuItemStyle = {
    display: "flex",
    columnGap: 1,
    justifyContent: "left",
    padding: "20px 40px 20px 40px",
    backgroundColor: insideDrawer ? "white" : "",
    margin: insideDrawer ? "2px" : "0px 0px 0px 0px",
  };
  const { getCurrentUser, handleCurrentUserLogout } = useUser();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  return (
    <>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(`/profile/${currentUser?.id}`);
        }}
        sx={menuItemStyle}
      >
        {insideDrawer ? (
          <CardMedia
            component="img"
            image={
              currentUser && currentUser.picture
                ? currentUser.picture.toString()
                : "/user_avatar.png"
            }
            sx={{
              width: "1.5em",
              height: "1.5em",
              borderRadius: "50%",
            }}
          />
        ) : (
          <AccountCircle fontSize="small" />
        )}
        <Typography variant="body1">Profile</Typography>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/account");
        }}
        sx={menuItemStyle}
      >
        <Settings fontSize="small" />
        <Typography variant="body1">Settings</Typography>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleCurrentUserLogout();
        }}
        sx={menuItemStyle}
      >
        <Logout fontSize="small" />
        <Typography variant="body1">Logout</Typography>
      </MenuItem>
    </>
  );
};

export default ProfileSettingsItems;

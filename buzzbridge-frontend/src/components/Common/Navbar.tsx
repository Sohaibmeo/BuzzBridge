import { ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { defaultButton, defaultTheme } from "../utils/themes/navbar";
// import Badge from '@mui/material/Badge';

// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';

import { Button, CardMedia, Fab, Link } from "@mui/material";
import CreateModal from "../Modals/CreateModal";
import CreateQuestionForm from "../Forms/CreateQuestionForm";
import { useEffect, useState } from "react";
import { useUser } from "../Providers/UserProvider";
import MenuNavbarDesktop from "../Custom/CustomNavbarMenu";
// import CustomSearchBar from '../Custom/CustomSearchBar';
import MenuIcon from "@mui/icons-material/Menu";
import CustomNavbarDrawer from "../Custom/CustomNavbarDrawer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function PrimarySearchAppBar() {
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  const [open, setOpen] = useState(false);
  const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);
  const [openCreateQuestionModal, setOpenCreateQuestionModal] =
    useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down enough to show the button
      const scrollThreshold = 200; // Adjust as needed
      if (window.scrollY > scrollThreshold) {
        setShowScrollUpButton(true);
      } else {
        setShowScrollUpButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ mb: "9ch" }}>
      {showScrollUpButton && <Fab
        onClick={() => scrollToTop()}
        sx={{
          zIndex: 1051,
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>}
      <ThemeProvider theme={defaultTheme}>
        {currentUser && (
          <AppBar
            position="fixed"
            sx={{
              boxShadow: "0px 0px 0px 1px inset #d2d4d9",
            }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2, display: { xs: "", lg: "none" } }}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/" underline="none" color="inherit">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { sm: "block" } }}
                >
                  BuzzBridge
                </Typography>
              </Link>
              {/* <CustomSearchBar /> */}
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  display: { md: "flex", xs: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {currentUser && (
                  <Button
                    sx={defaultButton}
                    onClick={() => setOpenCreateQuestionModal(true)}
                  >
                    <Typography variant="body2">Add Question</Typography>
                  </Button>
                )}
                <CardMedia
                  component="img"
                  image={
                    currentUser && currentUser.picture
                      ? currentUser.picture.toString()
                      : "/user_avatar.png"
                  }
                  sx={{
                    width: "2.2em",
                    height: "2.2em",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                  onClick={handleMenuOpen}
                />
              </Box>
            </Toolbar>
          </AppBar>
        )}
      </ThemeProvider>
      <MenuNavbarDesktop anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <CustomNavbarDrawer
        open={open}
        setOpen={setOpen}
        setOpenQuestionModal={setOpenCreateQuestionModal}
      />
      {openCreateQuestionModal && currentUser && (
        <CreateModal
          openModal={openCreateQuestionModal}
          setOpenModal={setOpenCreateQuestionModal}
          Children={
            <CreateQuestionForm
              setOpenCreateQuestionModal={setOpenCreateQuestionModal}
            />
          }
        />
      )}
    </Box>
  );
}

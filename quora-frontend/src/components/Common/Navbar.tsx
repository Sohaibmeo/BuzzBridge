import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { defaultButton, defaultTheme } from '../utils/themes/navbar';
// import Badge from '@mui/material/Badge';

// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';

import { Button, CardMedia, Link } from '@mui/material';
import CreateModal from '../Modals/CreateModal';
import CreateQuestionForm from '../Forms/CreateQuestionForm';
import { useState } from 'react';
import { useUser } from '../Providers/UserProvider';
import { useCookies } from 'react-cookie';
import MenuNavbarDesktop from '../Custom/CustomNavbarMenu';
// import CustomSearchBar from '../Custom/CustomSearchBar';

export default function PrimarySearchAppBar() {
  const [cookies] = useCookies(['jwt']);
  const { currentUser } = useUser();

  const [openCreateQuestionModal, setOpenCreateQuestionModal] =
    useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ mb: '10ch' }}>
      <ThemeProvider theme={defaultTheme}>
        {cookies.jwt && (
          <AppBar
            position="fixed"
            sx={{
              'box-shadow': '0px 0px 0px 1px inset #d2d4d9',
            }}
          >
            <Toolbar>
              {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton> */}
              <Link href="/" underline="none" color="inherit">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { sm: 'block' } }}
                >
                  BuzzBridge
                </Typography>
              </Link>
              {/* <CustomSearchBar /> */}
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
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
                      : '/user_avatar.png'
                  }
                  sx={{
                    width: '2.2em',
                    height: '2.2em',
                    borderRadius: '50%',
                    marginLeft: '10px',
                  }}
                  onClick={handleMenuOpen}
                />
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        )}
      </ThemeProvider>
      <MenuNavbarDesktop anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
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

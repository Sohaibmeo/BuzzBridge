import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import MoreIcon from '@mui/icons-material/MoreVert';

import { Button, CardMedia, Link } from '@mui/material';
import CreateModal from '../Modals/CreateModal';
import CreateQuestionForm from '../Forms/CreateQuestionForm';
import { useState } from 'react';
import { useUser } from '../Providers/UserProvider';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    border: '1px solid #d2d4d9',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [openCreateQuestionModal, setOpenCreateQuestionModal] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, handleCurrentUserLogout } = useUser();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  // eslint-disable-next-line
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link
        href={`/profile/${currentUser?.id}`}
        underline={'none'}
        color={'black'}
      >
        <MenuItem
          onClick={handleMenuClose}
          sx={{ display: 'flex', columnGap: 1, justifyContent: 'left' }}
        >
          <AccountCircle fontSize="small" />
          <Typography variant="body1">Profile</Typography>
        </MenuItem>
      </Link>
      <Link href={`/account`} underline={'none'} color={'black'}>
        <MenuItem
          onClick={handleMenuClose}
          sx={{ display: 'flex', columnGap: 1, justifyContent: 'left' }}
        >
          <Settings fontSize="small" />
          <Typography variant="body1">Settings</Typography>
        </MenuItem>
      </Link>
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

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {/* <AccountCircle /> */}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        mb: '5.125%',
      }}
    >
      {currentUser && (
        <AppBar
          position="fixed"
          color="transparent"
          enableColorOnDark
          sx={{
            backgroundColor: '#fff',
            'box-shadow': '0 3px 6px rgba(0,0,0,.04)',
          }}
        >
          <Toolbar sx={{ boxshadow: 'none !important' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/" underline="none" color="inherit">
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Quora
              </Typography>
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                color="error"
                sx={{
                  borderRadius: '16px',
                  border: '1px solid red ',
                }}
                onClick={() => setOpenCreateQuestionModal(true)}
              >
                <Typography variant="body2" color="text.error">
                  Add Question
                </Typography>
              </Button>
              {/* <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <CardMedia
                component="img"
                image={
                  currentUser.picture
                    ? currentUser.picture.toString()
                    : '/user_avatar.png'
                }
                sx={{
                  width: '2.2em',
                  height: '2.2em',
                  borderRadius: '50%',
                  marginLeft: '10px',
                }}
                onClick={handleProfileMenuOpen}
              />
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      {renderMobileMenu}
      {renderMenu}
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

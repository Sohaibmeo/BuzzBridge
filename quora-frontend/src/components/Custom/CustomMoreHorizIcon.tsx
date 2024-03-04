import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Link } from '@mui/material';
import { useState } from 'react';
const CustomMoreHorizIcon = ({ id, type }: { id: number; type: string }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = ['Edit', 'Delete', 'Report', 'Share'];
  const handleOpenMoreMenu = () => {
    console.log('Open More Menu For : ' + id + ' ' + type);
    setOpenMenu((prev) => !prev);
  };

  return (
    <Box position={'relative'}>
      <MoreHorizIcon
        color="inherit"
        sx={{
          ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          borderRadius: '50%',
          padding: '0.5rem',
          color: 'rgba(0, 0, 0, 0.6)',
        }}
        onClick={() => {
          handleOpenMoreMenu();
        }}
      />
      <Box
        position={'absolute'}
        top={'2.5rem'}
        display={openMenu ? 'flex' : 'none'}
        flexDirection={'column'}
        width={'max-content'}
        right={'0.5rem'}
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
        zIndex={1}
      >
        {menuOptions.map((option, index) => (
          <Link
            key={index}
            sx={{
              textDecoration: 'none',
              color: 'rgba(0, 0, 0, 0.6)',
              padding: '0.5rem',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {option}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default CustomMoreHorizIcon;

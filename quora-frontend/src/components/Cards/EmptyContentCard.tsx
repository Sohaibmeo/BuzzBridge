import { Box, CardContent, Skeleton, Typography } from '@mui/material';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { useEffect, useState } from 'react';

const EmptyContentCard = ({ type }: { type: string }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <>
      {loading ? (
        <CardContent sx={{backgroundColor:'white'}} >
          <Box sx={{display:'flex', alignItems:'center'}}>
          <Skeleton variant="circular" animation={'wave'} width={60} height={60} sx={{mr:'1%'}}/>
          <Skeleton variant="text" animation={'wave'} width={100} height={50} />
          </Box>
          <Skeleton variant="text" animation={'wave'} width={'100%'} height={50} />
          <Skeleton variant="rectangular" animation={'wave'} width={'100%'} height={175} />
        </CardContent>
      ) : (
        <CardContent
          sx={{
            p: 2,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ManageSearchOutlinedIcon sx={{ color: '#e0e0e0', fontSize: 250 }} />
          <Typography variant="h6" color={'#6e6e6e'} gutterBottom>
            Looks like no {type}'s available
          </Typography>
        </CardContent>
      )}
    </>
  );
};

export default EmptyContentCard;

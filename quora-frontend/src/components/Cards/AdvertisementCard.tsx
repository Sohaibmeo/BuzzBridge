import { CardContent, Typography } from '@mui/material';

const AdvertisementCard = () => {
  return (
    <CardContent
      sx={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Typography color={'#636466'} textAlign={'center'}>
        Advertisement
      </Typography>
    </CardContent>
  );
};

export default AdvertisementCard;

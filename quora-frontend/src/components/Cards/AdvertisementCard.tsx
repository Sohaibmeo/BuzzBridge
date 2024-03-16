import { CardContent, Typography } from '@mui/material';

const AdvertisementCard = () => {
  return (
    <CardContent
      sx={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0px 0px 0px 1px inset #d2d4d9',
        ':hover': { boxShadow: 3 },
      }}
    >
      <Typography color={'#636466'} textAlign={'center'}>
        Advertisement
      </Typography>
    </CardContent>
  );
};

export default AdvertisementCard;

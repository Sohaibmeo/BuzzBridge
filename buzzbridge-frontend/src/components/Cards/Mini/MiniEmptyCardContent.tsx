import { CardContent, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

const MiniEmptyCardContent = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading ? (
        <Box>
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton variant="rectangular" height={50} />
        </Box>
      ) : (
        <CardContent
          sx={{
            p: 4,
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '14px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <ManageSearchOutlinedIcon sx={{ color: '#cbd5e1', fontSize: 80 }} />
          <Typography variant="subtitle1" color={'#475569'} gutterBottom>
            No Search Results
          </Typography>
        </CardContent>
      )}
    </>
  );
};

export default MiniEmptyCardContent;

import { Box, CircularProgress, Fab } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CrossIcon from '@mui/icons-material/Close';

const CustomLoadingButton = ({
  loading,
  success,
  handleSubmit,
}: {
  loading: boolean;
  success: boolean | null;
  handleSubmit: any;
}) => {
  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Fab
        aria-label="save"
        color="primary"
        sx={{
          backgroundColor: success
            ? 'green'
            : success === null
              ? ''
              : '#d32f2f',
          '&:hover': {
            backgroundColor: success ? 'rgb(56, 142, 60)' : 'rgb(25, 118, 210)',
          },
        }}
        type="submit"
        onClick={handleSubmit}
      >
        {success === null ? (
          <SaveIcon />
        ) : success ? (
          <CheckIcon />
        ) : (
          <CrossIcon />
        )}
      </Fab>
      {loading && (
        <CircularProgress
          size={68}
          sx={{
            color: 'green',
            fontWeight: 'bold',
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default CustomLoadingButton;

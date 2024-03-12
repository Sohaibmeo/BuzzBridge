import { useAlert } from '../Providers/AlertProvider';
import { Button, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import styled from '@emotion/styled';

const CustomImgUpload = ({
  setFormData,
  height,
  width,
  customText,
  children,
  hover,
  borderRadius,
}: {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  height?: string | number;
  width?: string | number;
  customText?: string;
  children?: React.ReactNode;
  hover?: boolean;
  borderRadius?: string | number;
}) => {
  const { showAlert } = useAlert();
  const handleSuccess = (e: any) => {
    setFormData((prev: any) => ({ ...prev, file: e.target.files[0] }));
    showAlert('success', 'Image uploaded');
  };
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const [hoverIcon, setHoverIcon] = useState(false);
  return (
    <Button
      component="label"
      variant="contained"
      color="inherit"
      startIcon={!children && <CloudUploadIcon />}
      fullWidth
      sx={{
        height: { height },
        width: { width },
        borderRadius: { borderRadius },
        position: 'relative',
        padding: hover ? 0 : '',
        opacity: hover && hoverIcon ? 0.8 : 1,
      }}
      onMouseEnter={() => setHoverIcon(true)}
      onMouseLeave={() => setHoverIcon(false)}
    >
      {children}
      {hover && (
        <Fade in={hoverIcon}>
          <EditIcon
            fontSize="large"
            color="inherit"
            sx={{
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        </Fade>
      )}
      {customText || 'Attach an Image'}
      <VisuallyHiddenInput type="file" onChange={handleSuccess} />
    </Button>
  );
};

export default CustomImgUpload;

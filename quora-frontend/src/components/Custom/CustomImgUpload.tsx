import { IKUpload } from 'imagekitio-react';
import imageKitAuth from '../../helpers/authenticateImgkitUrl';
import { useAlert } from '../Providers/AlertProvider';
import { Button, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

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
    console.log(e);
    setFormData((prev: any) => ({ ...prev, picture: e.url }));
    showAlert('success', 'Image uploaded');
  };
  const onUploadStart = (evt: any) => {
    console.log('Upload Star Started', evt);
    showAlert('info', 'Uploading..');
  };

  const onUploadProgress = (evt: any) => {
    showAlert('info', 'Just a moment..');
    console.log('Progress: ', evt);
  };
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
      <IKUpload
        style={{ display: 'none' }}
        onError={(e) => showAlert('error', e.message)}
        onSuccess={(e) => handleSuccess(e)}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
        authenticator={imageKitAuth}
      />
    </Button>
  );
};

export default CustomImgUpload;

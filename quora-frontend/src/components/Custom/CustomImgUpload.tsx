import { IKUpload } from 'imagekitio-react';
import imageKitAuth from '../../helpers/authenticateImgkitUrl';
import { useAlert } from '../Providers/AlertProvider';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CustomImgUpload = ({
  setFormData,
  height,
}: {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  height?: string | number;
}) => {
  const { showAlert } = useAlert();
  const handleSuccess = (e: any) => {
    console.log(e);
    showAlert('success', 'Image uploaded');
    setFormData((prev: any) => ({ ...prev, picture: e.url }));
  };
  return (
    <Button
      component="label"
      variant="contained"
      color="inherit"
      startIcon={<CloudUploadIcon />}
      fullWidth
      sx={{height: {height}}}
    >
      Attach an Image
      <IKUpload
        style={{ display: 'none' }}
        onError={(e) => showAlert('error', e.message)}
        onSuccess={(e) => handleSuccess(e)}
        publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
        authenticator={imageKitAuth}
      />
    </Button>
  );
};

export default CustomImgUpload;

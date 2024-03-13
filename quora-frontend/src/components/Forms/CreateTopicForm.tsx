import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CreateTopic } from '../../types/TopicTypes';
import { useAlert } from '../Providers/AlertProvider';
import customAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';

const CreateTopicForm = ({
  setOpenCreateTopicModal,
}: {
  setOpenCreateTopicModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState<CreateTopic>({
    title: '',
    description: '',
    picture: null,
  });
  // eslint-disable-next-line
  const axiosInstance = customAxios();
  const { handleCurrentUserLogout } = useUser();
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { picture, ...rest } = formData;
      const reponseUrl = formData.picture
        ? await axiosInstance.post(
            '/auth/imagekit/getImageUrl',
            { file: picture },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        : null;
      const response = await axiosInstance.post('/topic', {
        ...rest,
        picture: reponseUrl?.data || null,
      });
      if (response.data === 'Succesful') {
        showAlert('success', 'Topic Created');
        setOpenCreateTopicModal(false);
      } else {
        showAlert('error', response.data);
      }
    } catch (error: any) {
      showAlert('error', error.message);
      if (error.response.status === 401) {
        handleCurrentUserLogout();
        setOpenCreateTopicModal(false);
      }
    }
  };
  return (
    <Container maxWidth="md">
      <Box
        style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Topic
        </Typography>
        {formData.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{ mb: 2, height: '200px', width: '200px' }}
          />
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Title"
                name="title"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                multiline
                required
                fullWidth
                maxRows={19}
                label="Description"
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={4} display={'flex'} alignItems={'center'}>
              <CustomImgUpload
                setFormData={setFormData}
                customText="Add an Image"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              columnGap: 1,
              mt: '3%',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              disabled={!formData.picture}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateTopicModal(false)}
              style={{ marginTop: '16px' }}
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTopicForm;

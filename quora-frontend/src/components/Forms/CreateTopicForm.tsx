import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CreateTopic } from '../../types/TopicTypes';
import { useAlert } from '../Providers/AlertProvider';
import customAxios from '../../helpers/customAxios';
import { useCookies } from 'react-cookie';
import CustomImgUpload from '../Custom/CustomImgUpload';

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
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const axiosInstance = customAxios();
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formData);
    try {
      const {picture, ...rest} = formData;
      const response = await axiosInstance.post('/auth/getImageUrl', picture, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      const response2 = await axiosInstance.post('/topic', rest);
      console.log(response2);
      if (response2.data === 'Succesful') {
        showAlert('success', 'Topic Created');
        setOpenCreateTopicModal(false);
      } else {
        showAlert('error', response2.data);
      }
    } catch (error: any) {
      showAlert('error', error.message);
      if (error.response2.status === 401) {
        removeCookie('jwt');
        setOpenCreateTopicModal(false);
      }
    }
  };
  return (
    <Container maxWidth="md">
      <div
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
                maxRows={21}
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
              disabled={!(formData.picture)}
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
      </div>
    </Container>
  );
};

export default CreateTopicForm;

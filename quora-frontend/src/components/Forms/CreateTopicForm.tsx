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
import useCustomAxios from '../../helpers/customAxios';
import { useCookies } from 'react-cookie';

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
  const axiosInstance = useCustomAxios();
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/topic', formData);
      if (response.data === 'Succesful') {
        showAlert('success', 'Topic Created');
        setOpenCreateTopicModal(false);
      } else {
        showAlert('error', response.data);
      }
    } catch (error: any) {
      showAlert('error', error.message);
      if (error.response.status === 401) {
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Image"
                name="picture"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
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

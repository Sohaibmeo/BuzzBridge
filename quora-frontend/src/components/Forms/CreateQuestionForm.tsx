import {
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAlert } from '../Providers/AlertProvider';
import { CreateQuestion } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CreateQuestionForm = ({
  setOpenCreateQuestionModal,
}: {
  setOpenCreateQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [formData, setFormData] = useState<CreateQuestion>({
    title: '',
    assignedTopics: [],
    picture: null,
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/question/',
        formData,
        { withCredentials: true },
      );
      if (response.status === 201 && response.data === 'Succesful') {
        showAlert('success', 'Question Created');
        setOpenCreateQuestionModal(false);
        navigate(0);
      } else {
        showAlert('error', 'Unexpected ERROR: ' + response.data);
      }
    } catch (error: any) {
      showAlert(
        'error',
        error.response.status + ' ' + error.response.statusText,
      );
      if (error.response.status === 401) {
        removeCookie('jwt');
        navigate('/login');
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/topic/');
        setTopics(response.data);
      } catch (error: any) {
        showAlert('error', error.message);
      }
    };
    fetchData();
  }, [showAlert]);
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
          Add Question
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                maxRows={16}
                label="Question"
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
                select
                value={formData.assignedTopics}
                fullWidth
                placeholder="Select Topics"
                name="assignedTopics"
                label="Topics"
                SelectProps={{
                  multiple: true,
                }}
                onChange={(e: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Post Question
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => setOpenCreateQuestionModal(false)}
            style={{ marginTop: '16px' }}
          >
            Close
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CreateQuestionForm;

import {
  Button,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { CreateAnswer } from '../../types/AnswerTypes';
import customAxios from '../../helpers/customAxios';

const CreateAnswerForm = ({
  questionId,
  setAnswers,
}: {
  questionId: number;
  setAnswers: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [formData, setFormData] = useState<CreateAnswer>({
    description: '',
    question: questionId,
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const axiosInstance = customAxios();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/answer/', {
        ...formData,
        question: questionId,
      });
      if (response.status === 201 && response.data.message === 'Succesfully') {
        const answer = await axiosInstance.get(`/answer/${response.data.id}`);
        console.log(answer.data);
        showAlert('success', 'Answer Posted');
        setAnswers((prev: any) => prev.concat(answer.data));
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
  return (
    <Container maxWidth="md">
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <Typography variant="h4" gutterBottom></Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                columnGap: 1,
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: '45px', height: '45px', borderRadius: '50%' }}
                image={process.env.PUBLIC_URL + '/user_avatar.png'}
                alt="user avatar"
              />
              <TextField
                variant="outlined"
                required
                multiline //TODO: this is causing an error by MUI side when resizing
                sx={{ width: '400px', backgroundColor: 'white' }}
                placeholder="Add a comment here..."
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: '140px', height: '30px' }}
              >
                <Typography variant="body2" fontSize={'12px'}>
                  Post Answer
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default CreateAnswerForm;

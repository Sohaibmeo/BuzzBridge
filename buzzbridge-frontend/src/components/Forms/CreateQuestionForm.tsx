import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { CreateQuestion } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import CustomLoadingButton from '../Custom/CustomLoadingButton';

const CreateQuestionForm = ({
  setOpenCreateQuestionModal,
}: {
  setOpenCreateQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { expireCurrentUserSession } = useUser();
  const [formData, setFormData] = useState<CreateQuestion>({
    title: null,
    assignedTopics: null,
    picture: null,
  });
  const axiosInstance = customAxios();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { picture, ...rest } = formData;
      const responseImage = formData?.picture
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
      const response = await axiosInstance.post('/question/', {
        ...rest,
        picture: responseImage?.data?.url || null,
        fileId: responseImage?.data?.fileId || null,
      });
      if (response.status === 201 && response.data === 'Succesful') {
        showAlert('success', 'Question Created');
        setOpenCreateQuestionModal(false);
        setLoading(false);
        setSuccess(true);
        navigate(0);
      } else {
        setLoading(false);
        setSuccess(false);
        throw new Error('Failed to create question (UNEXCPECTED ERROR)');
      }
    } catch (error: any) {
      showAlert(
        'error',
        error.response.status + ' ' + error.response.statusText,
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateQuestionModal(false);
      }
      setLoading(false);
      setSuccess(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/topic/');
        setTopics(response.data);
      } catch (error: any) {
        showAlert('error', error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {formData?.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{ mb: 2, height: '400px', width: '100%' }}
          />
        )}
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
            <Grid item lg={8} xs={12}>
              <TextField
                select
                value={formData?.assignedTopics ? formData?.assignedTopics : []}
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
            <Grid item lg={4} xs={12} display={'flex'} alignItems={'center'}>
              <CustomImgUpload setFormData={setFormData} height={'90%'} />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              mt: '3%',
              columnGap: 1,
            }}
          >
            <CustomLoadingButton
              loading={loading}
              success={success}
              handleSubmit={handleSubmit}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateQuestionModal(false)}
            >
              Close
            </Button>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default CreateQuestionForm;

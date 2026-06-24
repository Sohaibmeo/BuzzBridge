import {
  Box,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { CreateQuestion } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../utils/helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQuestionSchema } from '../..//utils/schema/questionSchema';

const CreateQuestionForm = ({
  setOpenCreateQuestionModal,
}: {
  setOpenCreateQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { expireCurrentUserSession } = useUser();
  const [formData, setFormData] = useState<CreateQuestion>({
    title: '',
    assignedTopics: [],
  });
  const axiosInstance = useCustomAxios();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleData = async (e: any) => {
    setLoading(true);
    try {
      const { picture } = formData;
      let body = { ...formData };
      if (picture) {
        const responseImage = await axiosInstance.post(
          '/image/imagekit/getImageUrl',
          { file: picture },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        body = {
          ...formData,
          picture: responseImage?.data?.url || null,
          fileId: responseImage?.data?.fileId || null,
        };
      }

      await axiosInstance.post('/question/', body);
      showAlert('success', 'Question Created');
      setOpenCreateQuestionModal(false);
      setLoading(false);
      navigate(0);
    } catch (error: any) {
      showAlert(
        'error',
        error.response?.data?.message || error.message || 'An error occured',
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateQuestionModal(false);
      }
      setLoading(false);
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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateQuestion>({
    resolver: zodResolver(CreateQuestionSchema),
    defaultValues: {
      assignedTopics: [],
    },
    mode: 'onChange',
  });
  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box sx={{ pt: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={0.75} sx={{ mb: 2.5, pr: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0 }}>
            Add Question
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask clearly and attach media only when it helps people understand
            the problem faster.
          </Typography>
        </Stack>
        {formData?.picture && (
          <Box
            sx={{
              mb: 2.5,
              p: 1,
              bgcolor: '#f8fafc',
              border: '1px solid #e5eaf1',
              borderRadius: '16px',
            }}
          >
            <CardMedia
              component={
                formData.picture.type.startsWith('image/') ? 'img' : 'video'
              }
              height="fit-content"
              src={URL.createObjectURL(formData?.picture)}
              alt="Question media preview"
              sx={{
                maxHeight: 300,
                width: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </Box>
        )}
        <form onSubmit={handleSubmit(handleData)} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                {...register('title', { onChange: handleChange })}
                fullWidth
                multiline
                maxRows={16}
                label="Question"
                helperText={errors.title?.message}
                error={Boolean(errors.title?.message)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    bgcolor: '#fbfdff',
                    '& fieldset': { borderColor: '#dbe3ef' },
                    '&:hover fieldset': { borderColor: '#9ab7ef' },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4f8df7',
                      boxShadow: '0 0 0 3px rgba(79, 141, 247, 0.12)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item lg={8} xs={12}>
              <FormLabel
                htmlFor="select-multiple-chip"
                sx={{ mb: 0.75, display: 'block', fontWeight: 700 }}
              >
                Topics
              </FormLabel>
              <Select
                {...register('assignedTopics')}
                fullWidth
                labelId="multi-select-topics"
                multiple
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                onOpen={() => {
                  setOpen(true);
                }}
                id="tags-outlined"
                defaultValue={[]}
                onChange={(e: any) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignedTopics: e.target.value,
                  }));
                  setOpen(false);
                }}
                error={Boolean(errors.assignedTopics?.message)}
                variant="outlined"
                label="Topics"
                placeholder="Select Topics"
                input={<OutlinedInput id="select-multiple-chip" />}
                sx={{
                  borderRadius: '14px',
                  bgcolor: '#fbfdff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dbe3ef',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ab7ef',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4f8df7',
                    boxShadow: '0 0 0 3px rgba(79, 141, 247, 0.12)',
                  },
                }}
                inputProps={{
                  label: 'Topics',
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      return (
                        <Chip
                          key={value}
                          label={
                            topics.find((topic) => topic.id === value)?.title
                          }
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={Boolean(errors.assignedTopics?.message)}>
                {errors.assignedTopics?.message}
              </FormHelperText>
            </Grid>
            <Grid
              item
              lg={4}
              xs={12}
              display={'flex'}
              alignItems={'center'}
              mt={{ lg: '30px', xs: 0 }}
            >
              <CustomImgUpload setFormData={setFormData} height={'56px'} />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 3 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
              pt: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseRoundedIcon />}
              onClick={() => setOpenCreateQuestionModal(false)}
              sx={{
                borderRadius: '999px',
                px: 2.5,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveRoundedIcon />
                )
              }
              disabled={loading}
              sx={{
                borderRadius: '999px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 800,
                boxShadow: '0 10px 24px rgba(25, 118, 210, 0.24)',
              }}
            >
              Publish Question
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateQuestionForm;

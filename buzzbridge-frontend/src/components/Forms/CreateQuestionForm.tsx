import {
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
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
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { CreateQuestion } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../utils/helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import CustomLoadingButton from '../Custom/CustomLoadingButton';
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
  const [success, setSuccess] = useState<boolean | null>(null);
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
      setSuccess(true);
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
      <Box sx={{ pt: { xs: 3, sm: 4 } }}>
        <Stack spacing={0.5} sx={{ mb: 3, pr: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Add Question
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask clearly, add a helpful topic, and attach media if it makes the
            question easier to understand.
          </Typography>
        </Stack>
        {formData?.picture && (
          <CardMedia
            component={
              formData.picture.type.startsWith('image/') ? 'img' : 'video'
            }
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{
              mb: 3,
              maxHeight: 320,
              width: '100%',
              objectFit: 'cover',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
            }}
          />
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
                    borderRadius: '12px',
                    bgcolor: '#fbfdff',
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
                  borderRadius: '12px',
                  bgcolor: '#fbfdff',
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 3,
              columnGap: 1,
              flexWrap: 'wrap',
            }}
          >
            <CustomLoadingButton loading={loading} success={success} />
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenCreateQuestionModal(false)}
              sx={{
                mt: 1.1,
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateQuestionForm;

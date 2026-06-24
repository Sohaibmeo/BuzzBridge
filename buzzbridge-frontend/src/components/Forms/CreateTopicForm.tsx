import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useState } from 'react';
import { CreateTopic, TopicTypes } from '../../types/TopicTypes';
import { useAlert } from '../Providers/AlertProvider';

import useCustomAxios from '../../utils/helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopicSchema } from '../../utils/schema/topicSchema';

const CreateTopicForm = ({
  setOpenCreateTopicModal,
  setTopics,
}: {
  setOpenCreateTopicModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTopics: React.Dispatch<React.SetStateAction<TopicTypes[]>>;
}) => {
  const [formData, setFormData] = useState<CreateTopic>({
    title: '',
  });
  // eslint-disable-next-line
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
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
          ...body,
          picture: responseImage?.data?.url,
          fileId: responseImage?.data?.fileId,
        };
      }
      const response = await axiosInstance.post('/topic', body);
      showAlert('success', 'Topic Created');
      setOpenCreateTopicModal(false);
      setTopics((prev) => [response.data, ...prev]);
      setLoading(false);
    } catch (error: any) {
      showAlert(
        'error',
        error.response?.data?.message || error.message || 'An error occured',
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateTopicModal(false);
      }
      setLoading(false);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateTopic>({
    resolver: zodResolver(TopicSchema),
  });
  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
      <Box
        sx={{
          pt: { xs: 2.5, sm: 3 },
        }}
      >
        <Stack spacing={0.75} sx={{ mb: 2.5, pr: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0 }}>
            Add Topic
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Give the community a focused place to collect related questions.
          </Typography>
        </Stack>
        {formData.picture && (
          <Box
            sx={{
              mb: 2.5,
              p: 1,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
            }}
          >
            <CardMedia
              component="img"
              height="fit-content"
              src={URL.createObjectURL(formData?.picture)}
              alt="Topic preview"
              sx={{
                height: 180,
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
                {...register('title', { onChange: handleChange })}
                error={Boolean(errors.title?.message)}
                variant="outlined"
                fullWidth
                label="Title"
                helperText={errors.title?.message}
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
              <TextField
                variant="outlined"
                {...register('description', { onChange: handleChange })}
                error={Boolean(errors.description?.message)}
                multiline
                fullWidth
                maxRows={19}
                label="Description"
                helperText={errors.description?.message}
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
            <Grid item lg={4} xs={12} display={'flex'} alignItems={'center'}>
              <CustomImgUpload
                setFormData={setFormData}
                onlyImage
                customText="Image"
                height={'56px'}
                width={'100%'}
              />
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
              onClick={() => setOpenCreateTopicModal(false)}
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
              Create Topic
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTopicForm;

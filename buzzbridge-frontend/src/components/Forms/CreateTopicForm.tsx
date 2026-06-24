import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CreateTopic, TopicTypes } from '../../types/TopicTypes';
import { useAlert } from '../Providers/AlertProvider';

import useCustomAxios from '../../utils/helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import CustomLoadingButton from '../Custom/CustomLoadingButton';
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
  const [success, setSuccess] = useState<boolean | null>(null);
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
      setSuccess(true);
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
      setSuccess(false);
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
          pt: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 3, pr: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Add Topic
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Give the community a focused place to collect related questions.
          </Typography>
        </Stack>
        {formData.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Topic Picture"
            sx={{
              mb: 3,
              height: 180,
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
                {...register('title', { onChange: handleChange })}
                error={Boolean(errors.title?.message)}
                variant="outlined"
                fullWidth
                label="Title"
                helperText={errors.title?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fbfdff',
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
                    borderRadius: '12px',
                    bgcolor: '#fbfdff',
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              columnGap: 1,
              mt: 3,
              flexWrap: 'wrap',
            }}
          >
            <CustomLoadingButton loading={loading} success={success} />
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenCreateTopicModal(false)}
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

export default CreateTopicForm;

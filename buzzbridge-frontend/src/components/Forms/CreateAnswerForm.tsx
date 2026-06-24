import { Box, Container, Grid, InputBase, Typography } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { useNavigate } from 'react-router-dom';
import { CreateAnswer } from '../../types/AnswerTypes';
import useCustomAxios from '../../utils/helpers/customAxios';
import { useUser } from '../Providers/UserProvider';
import CustomLoadingButton from '../Custom/CustomLoadingButton';
import ArrowForward from '@mui/icons-material/ArrowForward';

const CreateAnswerForm = ({
  questionId,
  setAnswers,
}: {
  questionId: number;
  setAnswers: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [formData, setFormData] = useState<CreateAnswer>({
    description: null,
    question: questionId,
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession, getCurrentUser } = useUser();
  const user = getCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/answer/', {
        ...formData,
        question: questionId,
      });
      setFormData({ question: questionId, description: null });
      console.log(response);
      setSuccess(true);
      setLoading(false);
      showAlert('success', 'Answer Posted');
      setAnswers((prev: any) => [
        { ...response.data, belongsTo: user },
        ...prev,
      ]);
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert(
        'error',
        error.response?.data?.message || error.message || 'An error occured',
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        navigate('/login');
      }
    }
  };
  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, sm: 3 } }}>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
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
              <InputBase
                required
                maxRows={10}
                multiline
                value={formData.description || ''}
                sx={{
                  width: '85%',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #dbe3ef',
                  px: 2,
                  py: 1.5,
                  minHeight: 48,
                  maxHeight: 180,
                  overflow: 'auto',
                  fontSize: '1rem',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                }}
                placeholder="Add a comment..."
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <CustomLoadingButton
                loading={loading}
                success={success}
                Icon={<ArrowForward />}
                disabled={!formData.description?.trim()}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAnswerForm;

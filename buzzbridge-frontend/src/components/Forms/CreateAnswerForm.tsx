import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  InputBase,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { useNavigate } from 'react-router-dom';
import { CreateAnswer } from '../../types/AnswerTypes';
import useCustomAxios from '../../utils/helpers/customAxios';
import { useUser } from '../Providers/UserProvider';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

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
      setLoading(false);
      showAlert('success', 'Answer Posted');
      setAnswers((prev: any) => [
        { ...response.data, belongsTo: user },
        ...prev,
      ]);
    } catch (error: any) {
      setLoading(false);
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
          p: { xs: 0, sm: 0 },
          bgcolor: '#ffffff',
          borderRadius: '16px',
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              src={user?.picture || undefined}
              alt={user?.name || 'User'}
              sx={{ width: 40, height: 40, mt: 0.5 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <InputBase
                required
                maxRows={8}
                minRows={2}
                multiline
                value={formData.description || ''}
                sx={{
                  width: '100%',
                  bgcolor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #dbe3ef',
                  px: 2,
                  py: 1.4,
                  fontSize: '0.98rem',
                  lineHeight: 1.55,
                  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
                  transition: 'border-color 160ms ease, box-shadow 160ms ease',
                  '&:focus-within': {
                    bgcolor: '#ffffff',
                    borderColor: '#4f8df7',
                    boxShadow: '0 0 0 3px rgba(79, 141, 247, 0.12)',
                  },
                }}
                placeholder="Share a thoughtful comment..."
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 1.25 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendRoundedIcon />
                    )
                  }
                  disabled={loading || !formData.description?.trim()}
                  sx={{
                    borderRadius: '999px',
                    px: 2.5,
                    py: 0.9,
                    textTransform: 'none',
                    fontWeight: 800,
                    boxShadow: '0 8px 18px rgba(25, 118, 210, 0.24)',
                  }}
                >
                  Post
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default CreateAnswerForm;

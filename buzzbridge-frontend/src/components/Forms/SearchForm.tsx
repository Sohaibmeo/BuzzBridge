import {
  Box,
  Chip,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { useEffect, useRef, useState } from 'react';
import { QuestionType } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { User } from '../../types/UserTypes';
import { useAlert } from '../Providers/AlertProvider';
import useCustomAxios from '../../utils/helpers/customAxios';
import MiniEmptyCardContent from '../Cards/Mini/MiniEmptyCardContent';
import MiniCard from '../Cards/Mini/MiniCard';

const SearchForm = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [query, setQuery] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('questions');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const [loading, setLoading] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const handleLoadData = async () => {
    if (query) {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(
            `/search?query=${query}&type=${currentTab}`,
          );
          if (currentTab === 'questions') {
            setQuestions(data);
          } else if (currentTab === 'topics') {
            setTopics(data);
          } else {
            setUsers(data);
          }
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          showAlert('error', error?.response?.data?.message);
        }
      }, 700);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    handleLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, query]);

  const switchTabContent = ['questions', 'topics', 'users'];
  return (
    <Box sx={{ pt: 2 }}>
      <Stack spacing={0.5} sx={{ mb: 2.5, pr: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Search BuzzBridge
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find questions, topics, and people across the community.
        </Typography>
      </Stack>
      <Paper
        sx={{
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: '#d7dde8',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
        <InputBase
          autoFocus
          sx={{ ml: 1.5, flex: 1, py: 0.75, fontSize: '1rem' }}
          value={query}
          placeholder="What are you looking for?"
          onChange={handleChange}
          inputProps={{ 'aria-label': 'What are you looking for?' }}
        />
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          aria-label="clear search"
          disabled={Boolean(!query)}
          onClick={() => setQuery('')}
        >
          <ClearIcon />
        </IconButton>
      </Paper>
      <Grid>
        <Grid item xs={12} display={'flex'} justifyContent={'center'} mt={2}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 700,
              },
            }}
          >
            {switchTabContent.map((tab, index) => (
              <Tab
                key={index}
                value={tab}
                label={
                  <Chip
                    label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                    size="small"
                    variant={currentTab === tab ? 'filled' : 'outlined'}
                    color={currentTab === tab ? 'primary' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                }
                onClick={() => setCurrentTab(tab)}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid
          item
          overflow={'auto'}
          maxHeight={'360px'}
          sx={{
            pr: 0.5,
            mt: 1,
            '&::-webkit-scrollbar': { width: 8 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#cbd5e1',
              borderRadius: 999,
            },
          }}
        >
          {currentTab === 'topics' && (
            <>
              {topics && topics.length > 0 ? (
                <>
                  {topics.map((topic: TopicTypes) => (
                    <MiniCard
                      key={topic.id}
                      data={topic}
                      loading={loading}
                      currentTab={currentTab}
                      setOpenModal={setOpenModal}
                    />
                  ))}
                </>
              ) : (
                <MiniEmptyCardContent loading={loading} />
              )}
            </>
          )}
          {currentTab === 'questions' && (
            <>
              {questions && questions.length > 0 ? (
                <>
                  {questions.map((question: QuestionType) => (
                    <MiniCard
                      key={question.id}
                      loading={loading}
                      data={question}
                      currentTab={currentTab}
                      setOpenModal={setOpenModal}
                    />
                  ))}
                </>
              ) : (
                <MiniEmptyCardContent loading={loading} />
              )}
            </>
          )}
          {currentTab === 'users' && (
            <>
              {users && users.length > 0 ? (
                <>
                  {users.map((user: User) => (
                    <MiniCard
                      key={user.id}
                      data={user}
                      loading={loading}
                      currentTab={currentTab}
                      setOpenModal={setOpenModal}
                    />
                  ))}
                </>
              ) : (
                <MiniEmptyCardContent loading={loading} />
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchForm;

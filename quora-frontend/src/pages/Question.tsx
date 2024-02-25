import { useEffect, useState } from 'react';
import CreateAnswerForm from '../components/Forms/CreateAnswerForm';
import axios from 'axios';
import { QuestionType } from '../types/QuestionTypes';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

const Question = () => {
  const [question, setQuestion] = useState<QuestionType>({
    id: 0,
    title: '',
  });
  let { id } = useParams();

  useEffect(() => {
    async function getQuestionId() {
      const response = await axios.get(`http://localhost:3000/question/${id}`, {
        withCredentials: true,
      });
      setQuestion(response.data);
    }
    getQuestionId();
  }, [id]);
  return (
    <>
      <Grid container justifyContent={'center'} sx={{ mt: '2%' }}>
        <Grid item xs={4.5} sx={{ backgroundColor: 'white', mr: '1%' }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {question.title}
              </Typography>
              <Typography color="text.secondary">
                Question ID: {question.id}
              </Typography>
              <Typography color="text.secondary">
                Belongs To User ID: {question.belongsTo?.id}
              </Typography>
              <Typography color="text.secondary">
                {question.assignedTopics
                  ?.map((topic) => topic.title)
                  .join(', ')}
              </Typography>
              <CardMedia
                component="img"
                height="fit-content"
                src={question.picture?.toString()}
                alt="Question Picture"
              />
              <Typography variant="body2" color="text.secondary">
                Upvotes: {question.upvotedBy ? question.upvotedBy.length : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Downvote: {question.downvote ? question.downvote : ''}
              </Typography>
              <CreateAnswerForm
                questionId={question.id}
                setQuestion={setQuestion}
              />
              <Typography variant="body2" color="text.secondary">
                Answers:
                <ul>
                  {question.answers
                    ? question.answers.map((answer) => (
                        <li key={answer.id}>
                          {answer.description}
                          {answer.belongsTo?.id}
                        </li>
                      ))
                    : 'No answers'}
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            backgroundColor: 'white',
            height: 'fit-content',
          }}
        >
          <Typography>Empty Space Here</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Question;

import { Button, Container, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAlert } from '../Providers/AlertProvider'
import { CreateQuestion } from '../../types/QuestionTypes'
import { Topic } from '../../types/TopicTypes'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import e from 'express'

const CreateQuestionForm = ({setOpenCreateQuestionModal}:
  {
    setOpenCreateQuestionModal:React.Dispatch<React.SetStateAction<boolean>>
  }) => {
  const [topics,setTopics] = useState<Topic[]>([])
  const [formData,setFormData] = useState<CreateQuestion>({
    title:"",
    description:"",
    image:"",
    assignedTopics: []
  })
  const navigate = useNavigate()
  const [cookies,setCookie,removeCookie]=useCookies(['jwt'])
  const { showAlert } = useAlert()
  const handleSubmit = async(e:any) => {
    e.preventDefault();
    try {
      console.log("Form Data: ",formData)
      const response = await axios.post("http://localhost:3000/question/",formData, { withCredentials: true })
      console.log(response.data)
      if(response.status === 201 && response.data === "Succesful"){
        console.log("Question Posted")
        showAlert("success","Question Created")
        setOpenCreateQuestionModal(false)
      }else{
        showAlert("error",response.data)
      }
    } catch (error) {
      showAlert("error","Session Expired, Please Login Again : "+error)
      removeCookie('jwt')
      navigate('/login')
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/topic/")
        setTopics(response.data)
      } catch (error) {
        console.log("REQUEST FAILED: ",error)
      }
    }
    fetchData()
  },[])
  return (
    <Container maxWidth="md">
        <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Add Question
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={(e)=> setFormData((prev)=>({...prev, [e.target.name]:e.target.value}))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Image"
                  name="image"
                  onChange={(e)=> setFormData((prev)=>({...prev, [e.target.name]:e.target.value}))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  multiline
                  required
                  fullWidth
                  maxRows={21}
                  label="Description"
                  name="description"
                  onChange={(e)=> setFormData((prev)=>({...prev, [e.target.name]:e.target.value}))}
                />
              </Grid>
              <Grid item xs={12}>
              <Select
                labelId="topic-select-label"
                value={formData.assignedTopics}
                placeholder='Select Topics'
                fullWidth
                multiple
                label="Topics"
                name='assignedTopics'
                onChange={(e:any)=>setFormData((prev)=>({...prev,[e.target.name]:e.target.value})) }
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
            >
              Creat Topic
            </Button>
          </form>
        </div>
      </Container>
  )
}

export default CreateQuestionForm
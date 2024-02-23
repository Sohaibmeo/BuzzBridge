import { Button, Container, Grid, Link, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const CreateTopicForm = () => {
  const [formData,setFormData] = useState()
  const handleSubmit = () => {

  }
  return (
    <Container maxWidth="xs">
        <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={(e)=> setFormData((prev)=>({...prev, [e.target.name]:e.target.value}))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  onChange={(e)=> setFormData((prev)=>({...prev, [e.target.name]:e.target.value}))}
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
            >
              Login
            </Button>
          </form>
          <Grid container justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Grid item>
              <Link href='/signup' variant="body2">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
  )
}

export default CreateTopicForm
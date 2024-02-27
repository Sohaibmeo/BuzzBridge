import { CardMedia, Grid, Typography } from '@mui/material'
import React from 'react'

const NoMatch = () => {
  return (
    <Grid container >
        <Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'70vh'} >
            <CardMedia component="img" src='/not_found.png' alt="404" sx={{height:'200px',width:'200px'}} />
            <Typography variant={'h3'}>Page Not Found</Typography>
            <Typography variant={'body1'}>The page you are looking for doesn't exist</Typography>
        </Grid>
    </Grid>
  )
}

export default NoMatch
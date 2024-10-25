import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PercentageCircle from './PercentageCircle';
import './Dashboard.css';

const theme = createTheme({
 typography: {
  fontFamily: 'Georgia, serif',
 },
 components: {
  MuiCard: {
   styleOverrides: {
    root: {
     background: 'none',
    },
   },
  },
  MuiTypography: {
   styleOverrides: {
    root: {
     fontFamily: 'Georgia, serif',
    },
   },
  },
  MuiButton: {
   styleOverrides: {
    root: {
     textTransform: 'none',
     backgroundColor: 'black',
    },
   },
  },
 },
});

const Dashboard = () => {
 const [roadmaps, setRoadmaps] = useState([]);
 const navigate = useNavigate();

 // Fetch only the dynamic data for roadmaps
 useEffect(() => {
  const fetchRoadmaps = async () => {
   const token = localStorage.getItem('token');
   if (!token) {
    navigate('/login');
    return;
   }

   const response = await fetch('https://map-nation.onrender.com/api/roadmaps/roadmaps');
   const data = await response.json();
   setRoadmaps(data);
  };

  fetchRoadmaps();
 }, [navigate]);

 const handleResumeClick = (roadmapId) => {
  // Navigate to the roadmap detail page
  navigate(`/resume/${roadmapId}`);
 };

 return (
  <ThemeProvider theme={theme}>
   <div className="dashboard-container">
    <div className="overlay">
     <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
       {/* Static Section */}
       <Grid item xs={12} sm={6} md={4}>
        <Card>
         <CardContent className='card-1'>
          <Box flex={1}>
           <Typography variant="h6">Tasks Completed</Typography>
          </Box>
          <Box>
           <PercentageCircle value={75} /> {/* Static value */}
          </Box>
         </CardContent>
        </Card>
       </Grid>

       <Grid item xs={12} sm={6} md={4}>
        <Card>
         <CardContent className='card-2'>
          <Box flex={1}>
           <Typography variant="h6">Overall Progress</Typography>
          </Box>
          <Box>
           <PercentageCircle value={45} /> {/* Static value */}
          </Box>
         </CardContent>
        </Card>
       </Grid>

       {/* Dynamic Section - Resume */}
       <Grid item xs={12}>
        <Card>
         <CardContent className='card-4'>
          <Typography variant="h6" gutterBottom className="heading">
           <b><u>Continue Where You Left !!</u></b>
          </Typography>
          <Grid container className="tableHeaderContainer">
           <Grid item xs={1}>
            <Typography variant="body1" className="tableHeader">
             S No.
            </Typography>
           </Grid>
           <Grid item xs={3}>
            <Typography variant="body1" className="tableHeader">
             Name
            </Typography>
           </Grid>
           <Grid item xs={3}>
            <Typography variant="body1" className="tableHeader">
             Days
            </Typography>
           </Grid>
           <Grid item xs={2}>
            <Typography variant="body1" className="tableHeader">
             Action
            </Typography>
           </Grid>
           <Grid item xs={3}>
            <Typography variant="body1" className="tableHeader">
             Hours
            </Typography>
           </Grid>
          </Grid>

          {roadmaps.map((roadmap, index) => (
           <Grid container key={index} alignItems="center" className="tableRow">
            <Grid item xs={1}>
             <Typography variant="body1" className="tableContent">
              {index + 1}
             </Typography>
            </Grid>
            <Grid item xs={3}>
             <Typography variant="body1" className="tableContent">
              {roadmap.languageName}
             </Typography>
            </Grid>
            <Grid item xs={3}>
             <Typography variant="body1" className="tableContent">
              {roadmap.days}
             </Typography>
            </Grid>
            <Grid item xs={2}>
             <Button 
              onClick={() => handleResumeClick(roadmap._id)} 
              variant="contained" 
              color="primary">
              Resume
             </Button>
            </Grid>
            <Grid item xs={3}>
             <Typography variant="body1" className="tableContent">
              {roadmap.hours}
             </Typography>
            </Grid>
           </Grid>
          ))}
         </CardContent>
        </Card>
       </Grid>
      </Grid>
     </Container>
    </div>
   </div>
  </ThemeProvider>
 );
};

export default Dashboard;

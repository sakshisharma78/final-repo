import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const styles = {
  container: {
    margin: '20px auto',
    padding: '20px',
    maxWidth: '800px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  listItem: {
    margin: '10px 0',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
};

const Roadmaps = () => {
  const { id } = useParams(); // Ab 'id' use ho raha hai
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/roadmaps/${id}`); // 'id' ko fetch kar rahe hain
        const data = await response.json();
        console.log('Fetched Roadmap Data:', data); // Console me check karne ke liye
        setRoadmap(data);
      } catch (error) {
        console.error('Error fetching roadmap:', error); // Error agar aata hai to
      }
    };

    if (id) {
      console.log('Roadmap ID from URL:', id); // Console me check karo ID ko
      fetchRoadmap();
    }
  }, [id]); // Jab bhi 'id' change ho to fetch karo

  return (
    <Container style={styles.container}>
      <Typography variant="h4" style={styles.title} gutterBottom>
        Roadmap Details
      </Typography>
      {roadmap ? (
        <List>
          <ListItem style={styles.listItem}>
            <ListItemText
              primary={roadmap.languageName}
              secondary={`Days: ${roadmap.days}, Hours: ${roadmap.hours}, Preparing For: ${roadmap.preparingFor}`}
            />
          </ListItem>

          {roadmap.roadmapData && Object.keys(roadmap.roadmapData).map((dayKey) => (
  <ListItem key={dayKey} style={styles.listItem}>
    <ListItemText
      primary={`Day: ${dayKey}`}
      secondary={Object.keys(roadmap.roadmapData[dayKey]).map((detailKey) => (
        <div key={detailKey}>
          <strong>{detailKey}:</strong> {JSON.stringify(roadmap.roadmapData[dayKey][detailKey])}
        </div>
      ))}
    />
  </ListItem>
))}
        </List>
      ) : (
        <Typography>Loading roadmap details...</Typography>
      )}
    </Container>
  );
};

export default Roadmaps;

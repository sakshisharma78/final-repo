import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import './resume.css';

const Roadmaps = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/roadmaps/${id}`);
        const data = await response.json();
        console.log('Fetched Roadmap Data:', data);
        setRoadmap(data);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      }
    };

    if (id) {
      console.log('Roadmap ID from URL:', id);
      fetchRoadmap();
    }
  }, [id]);

  return (
    <Container className="roadmap-container">
      <Typography variant="h4" className="roadmap-title" gutterBottom>
        Roadmap Details
      </Typography>
      {roadmap ? (
        <List>
          <ListItem className="roadmap-item">
            <ListItemText
              primary={roadmap.languageName}
              secondary={`Days: ${roadmap.days}, Hours: ${roadmap.hours}, Preparing For: ${roadmap.preparingFor}`}
            />
          </ListItem>
          {roadmap.roadmapData && Object.keys(roadmap.roadmapData).map((dayKey) => (
            <ListItem key={dayKey} className="roadmap-item">
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

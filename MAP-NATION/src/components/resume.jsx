import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import './resume.css';

const Roadmaps = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [pptLinks, setPptLinks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('Fetched ID:', id);

  // Fetch roadmap details
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        console.log('Fetching roadmap...');
        const response = await fetch(`http://localhost:5000/api/roadmaps/${id}`);

        // Check if response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched roadmap data:', data);

        // Ensure roadmapData exists and is structured correctly
        if (data && data.roadmapData) {
          setRoadmap(data);
        } else {
          throw new Error('Invalid roadmap structure');
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        setError('Failed to load roadmap data.');
      }
    };

    if (id) {
      fetchRoadmap();
    }
  }, [id]);

  // Handle PPT generation
  const handleGeneratePPT = async (topic, dayIndex) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/generate-ppt', { topic });
      setPptLinks(prev => ({ ...prev, [dayIndex]: response.data.link }));
    } catch (error) {
      console.error('Error generating PPT:', error);
      setError('Failed to generate PPT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Container className="roadmap-container">
      <Typography variant="h4" className="roadmap-title" gutterBottom>
        Roadmap Details
      </Typography>

      {roadmap ? (
        <div className="topics-container">
          {Object.keys(roadmap.roadmapData).map((dayKey, dayIndex) => {
            const dayData = roadmap.roadmapData[dayKey];

            // Logging dayData to inspect its structure
            console.log(`Day ${dayKey} data:`, dayData);

            // Ensure dayData is valid and an object
            if (!dayData || typeof dayData !== 'object') {
              console.error(`Expected an object but got ${typeof dayData} for day: ${dayKey}`, dayData);
              return null;
            }

            return (
              <div key={dayIndex} className="day-container">
                <h2><u>{dayKey}</u></h2>

                {Object.entries(dayData).map(([topicKey, detail], topicIndex) => {
                  // Log topic details for inspection
                  console.log(`Topic ${topicKey} details:`, detail);

                  return (
                    <div key={topicIndex} className="topic-details">
                      <h3><u>Topic: {detail.topic || "No topic available"}</u></h3>
                      <p>Description: {detail.description || 'No description available'}</p>

                      <h4>Resources:</h4>
                      <div className="button-row">
                        {detail.topics && detail.topics.length > 0 ? (
                          detail.topics.map((resource, resourceIndex) => (
                            <Button
                              key={resourceIndex}
                              className="button2"
                              onClick={() => window.open(resource.link, "_blank")}
                            >
                              {resource.resource_type || "Resource"}
                            </Button>
                          ))
                        ) : (
                          <Typography>No resources available</Typography>
                        )}

                        <Button
                          className="button3"
                          onClick={() =>
                            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(detail.topic)}`, "_blank")
                          }
                        >
                          YouTube Link
                        </Button>
                      </div>

                      <h4>Task:</h4>
                      <p>{detail.topics || 'No task available'}</p>

                      <Button
                        className="button1"
                        onClick={() => handleGeneratePPT(detail.topic, `${dayKey}-${topicIndex}`)}
                        disabled={loading}
                      >
                        {loading ? 'Generating...' : 'Generate PPT'}
                      </Button>

                      {pptLinks[`${dayKey}-${topicIndex}`] && (
                        <div>
                          <h5>PPT Generated:</h5>
                          <a href={pptLinks[`${dayKey}-${topicIndex}`]} download>Download PPT</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <Typography>Loading roadmap details...</Typography>
      )}
    </Container>
  );
};

export default Roadmaps;

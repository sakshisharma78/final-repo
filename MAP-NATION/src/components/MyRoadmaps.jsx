import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

const Roadmaps = ({ id }) => {
  const [roadmap, setRoadmap] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pptLinks, setPptLinks] = useState({}); // To hold generated PPT links

  const fetchRoadmap = async () => {
  setLoading(true); // Start loading
  setError(null); // Reset error state
  try {
 const response = await fetch(`http://localhost:5000/api/roadmaps/${id}`);
 if (!response.ok) {
 if (response.status === 404) {
throw new Error('Invalid roadmap ID');
 } else {
throw new Error('Network response was not ok');
 }
 }

 const data = await response.json();
 console.log(data); // Log the response data

 // Ensure roadmapData exists and is an array
 if (data && Array.isArray(data.roadmapData)) {
 setRoadmap(data.roadmapData);
 } else {
 throw new Error('Invalid roadmap structure');
 }
  } catch (error) {
 console.error('Error fetching roadmap:', error);
 setError(error.message); // Set the error message
  } finally {
 setLoading(false); // End loading
  }
  };

  useEffect(() => {
  // Only fetch roadmap if id is defined
  if (id) {
 fetchRoadmap(); // Fetch roadmap data on component mount
  } else {
 setError('Roadmap ID is missing'); // Set error if ID is undefined
  }
  }, [id]);

  const handleGeneratePPT = async (topic) => {
  // Function to generate PPT
  setLoading(true);
  try {
 const response = await fetch(`http://localhost:5000/api/generatePPT`, {
 method: 'POST',
 headers: {
'Content-Type': 'application/json',
 },
 body: JSON.stringify({ topic }),
 });

 if (!response.ok) {
 throw new Error('Failed to generate PPT');
 }

 const result = await response.json();
 // Assuming result contains a link to the generated PPT
 setPptLinks((prevLinks) => ({
 ...prevLinks,
 [topic]: result.link, // Store link with topic as key
 }));
  } catch (error) {
 console.error('Error generating PPT:', error);
 setError('Failed to generate PPT.');
  } finally {
 setLoading(false);
  }
  };

  return (
  <Container className="roadmap-container">
 <Typography variant="h4" className="roadmap-title" gutterBottom>
 Roadmap Details
 </Typography>

 {loading ? ( // Show loading state
 <Typography>Loading...</Typography>
 ) : error ? ( // Show error if any
 <Typography color="error">{error}</Typography>
 ) : roadmap.length > 0 ? ( // Render roadmap if available
 <div className="topics-container">
{roadmap.map((dayData, dayIndex) => (
  <div key={dayIndex} className="day-container">
  <h2><u>Day {dayIndex + 1}</u></h2>

  {dayData.topics.map((detail, topicIndex) => (
 <div key={topicIndex} className="topic-details">
 <h3><u>Topic: {detail.topic || "No topic available"}</u></h3>
 <p>Description: {detail.description || 'No description available'}</p>

 <h4>Resources:</h4>
 <div className="button-row">
{detail.resources && detail.resources.length > 0 ? (
  detail.resources.map((resource, resourceIndex) => (
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
 <p>{detail.task_format || 'No task available'}</p>

 <Button
className="button1"
onClick={() => handleGeneratePPT(detail.topic)}
disabled={loading}
 >
{loading ? 'Generating...' : 'Generate PPT'}
 </Button>

 {pptLinks[detail.topic] && (
<div>
  <h5>PPT Generated:</h5>
  <a href={pptLinks[detail.topic]} download>Download PPT</a>
</div>
 )}
 </div>
  ))}
  </div>
))}
 </div>
 ) : (
 <Typography>No roadmap available.</Typography> // Message for empty roadmap
 )}
  </Container>
  );
};

export default Roadmaps;

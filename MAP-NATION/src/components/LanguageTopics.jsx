import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 
import "./LanguageTopics.css";

function LanguageTopics({ fullData }) {
  const [pptLinks, setPptLinks] = useState({}); // Handle ppt link per topic
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Handle errors
  const navigate = useNavigate(); // Use navigate for redirection

  const handleGeneratePPT = async (topic, dayIndex) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true); // Start loading
      setError(null); // Clear any previous errors

      // Make the API request
      const response = await axios.post("https://map-nation.onrender.com/api/generate-ppt", { topic });
      setPptLinks(prev => ({ ...prev, [dayIndex]: response.data.link })); // Set link for specific day

    } catch (error) {
      console.error("Error generating PPT:", error);
      setError("Failed to generate PPT. Please try again.");
    } finally {
      setLoading(false); // Stop loading after response/error
    }
  };

  return (
    <div className="topics-container">
      {fullData.output.roadmap.map((item, idx) => (
        <div key={idx} className="day-container">
          <h2><u>Day: {item.day}</u></h2>
          <h3 id="topic"><u>Topic: {item.topics[0].topic}</u></h3>
          <h4>Description: </h4>
          <p>{item.topics[0].description}</p>

          <h4>Resources:</h4>
          <div className="button-row">
            <button
              className="button2"
              onClick={() => window.open(item.topics[0].resources[0].link, "_blank", "noopener noreferrer")}
            >
              {item.topics[0].resources[0].resource_type}
            </button>

            <button
              className="button3"
              onClick={() =>
                window.open(
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(item.topics[0].topic)}`,
                  "_blank",
                  "noopener noreferrer"
                )
              }
            >
              YouTube Link
            </button>
          </div>

          <h4>Task:</h4>
          <p>{item.topics[0].task_format}</p>

          <button
            className="button1"
            onClick={() => handleGeneratePPT(item.topics[0].topic, idx)}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Generating...' : 'Generate PPT'}
          </button>

          {pptLinks[idx] && (
            <div>
              <h5>PPT Generated:</h5>
              <a href={pptLinks[idx]} download>
                Download PPT
              </a>
            </div>
          )}

          {error && <p className="error-message">{error}</p>} {/* Show error if present */}
        </div>
      ))}
    </div>
  );
}

export default LanguageTopics;

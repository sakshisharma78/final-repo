const express = require('express');
const run = require('../utils/geminiapi'); // Adjust path as needed
const Roadmap = require('../Models/roadmap');
const router = express.Router();

// Route to generate and save roadmap
router.post("/generate-roadmap", async (req, res) => {
 try {
  const { userId, languageName, days, hours, preparingFor } = req.body;

  if (!userId || !languageName || !days || !hours || !preparingFor) {
   return res.status(400).send('All fields are required');
  }

  // Construct the prompt
  const prompt = `Provide a learning plan for ${languageName} for ${days} days where I can spend ${hours} hours per day as I am preparing for ${preparingFor}.`;

  // Call the AI to generate the roadmap
  const response = await run(prompt);

  console.log("Raw AI response:", response); // Log raw response to check its format

  let roadmapData;

  // Check if the AI response is valid JSON
  try {
   roadmapData = JSON.parse(response); // Try to parse if it's valid JSON
  } catch (jsonError) {
   console.warn("Response is not valid JSON, handling as plain text.");
   // Fallback: Handle as plain text and structure manually
   roadmapData = {
    message: response // Store the plain text response in an object
   };
  }

  // Create and save a new roadmap
  const newRoadmap = new Roadmap({
   userId,
   languageName,
   days,
   hours,
   preparingFor,
   roadmapData, // Store the AI-generated roadmap data (either JSON or plain text)
   createdAt: new Date() // Optional: timestamp
  });

  await newRoadmap.save();

  // Send back the AI-generated response
  res.json(roadmapData); // Respond with the object data
 } catch (error) {
  console.log('Error generating roadmap:', error);
  res.status(500).send("There was an error generating the roadmap.");
 }
});


// Route to get all roadmaps
router.get("/roadmaps", async (req, res) => {
  try {
  // Fetch all roadmaps from the database
  const roadmaps = await Roadmap.find();
  
  // If no roadmaps found, send appropriate response
  if (!roadmaps || roadmaps.length === 0) {
  return res.status(404).send('No roadmaps found');
  }
  
  // Send the fetched roadmaps
  res.json(roadmaps);
  } catch (error) {
  console.log('Error fetching roadmaps:', error);
  res.status(500).send("There was an error fetching the roadmaps.");
  }
  });

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const roadmap = await Roadmap.findById(id); // Fetch a specific roadmap by ID
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roadmap details' });
    }
});
  

module.exports = router;

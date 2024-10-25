// connectDB.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
   try {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
   useUnifiedTopology: true, // Only this is needed
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
   } catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1); // Exit process with failure
   }
  };
  

module.exports = connectDB; // Ensure this is present

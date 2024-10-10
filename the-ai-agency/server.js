import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import OpenAI from 'openai'; // Correct import

import agentRoutes from './routes/agents.js';
import projectRoutes from './routes/projects.js';

// Load environment variables
dotenv.config();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted if the environment variable is set
});

export { openai };

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend port
    credentials: true,
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Check if OPENAI_API_KEY is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
  process.exit(1);
} else {
  console.log('OPENAI_API_KEY is loaded');
}

// Use Routes
app.use('/api/agents', agentRoutes);
app.use('/api/projects', projectRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Log requested files
app.use((req, res, next) => {
  console.log('Requested file:', req.url);
  next();
});

// Error handling middleware for Multer and other errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ message: 'File upload error', error: err.message });
  } else if (err) {
    console.error('General error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
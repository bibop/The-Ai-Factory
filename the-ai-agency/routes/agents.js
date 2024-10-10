// routes/agents.js

import express from 'express';
import Agent from '../models/Agent.js';
import upload from '../config/multer.js';
import { openai } from '../server.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const router = express.Router();

console.log('Agent routes loaded');

router.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { name, gender, skills, generateAIImage } = req.body;
    let imagePath = null;

    if (generateAIImage === 'true') {
      // Generate AI image
      const imagePrompt = `Photorealistic portrait of a ${gender} named ${name}, expert in ${skills}.`;
      try {
        const response = await openai.images.generate({
          prompt: imagePrompt,
          n: 1,
          size: '256x256',
          response_format: 'url',
        });

        const imageUrl = response.data[0].url;
        const imageResponse = await fetch(imageUrl);
        const buffer = await imageResponse.buffer();
        const filename = `ai-image-${Date.now()}.png`;
        const imageSavePath = path.join('uploads', filename);

        await fs.writeFile(imageSavePath, buffer);
        imagePath = filename;
      } catch (imageError) {
        console.error('Error generating AI image:', imageError);
        return res.status(500).json({ message: 'Error generating AI image', error: imageError.message });
      }
    } else if (req.file) {
      imagePath = req.file.filename;
    }

    // Create new agent
    const newAgent = new Agent({
      name,
      gender,
      skills: skills.split(',').map(skill => skill.trim()),
      image: imagePath,
      aiGeneratedImage: generateAIImage === 'true' ? imagePath : null,
    });

    const savedAgent = await newAgent.save();
    res.status(201).json(savedAgent);
  })
);

// Get All Agents Route
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const agents = await Agent.find();
    res.json(agents);
  })
);

// Suggest a Name Route
router.get(
  '/suggest-name',
  asyncHandler(async (req, res) => {
    const prompt = 'Suggest a unique and professional name for an AI agent.';
    try {
      const completionResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
      });

      const name = completionResponse.choices[0].message.content.trim();
      res.json({ name });
    } catch (error) {
      console.error('Error suggesting name:', error);
      res.status(500).json({ message: 'Error suggesting name', error: error.message });
    }
  })
);

// Suggest Skills Route
router.post(
  '/suggest-skills',
  asyncHandler(async (req, res) => {
    const { name, gender } = req.body;
    const prompt = `Suggest 5 professional skills for an AI agent named ${name}, who is ${gender}. Provide the skills as a comma-separated list.`;
    try {
      const completionResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
      });

      const skillsText = completionResponse.choices[0].message.content.trim();
      const skills = skillsText.split(',').map((skill) => skill.trim());
      res.json({ skills });
    } catch (error) {
      console.error('Error suggesting skills:', error);
      res.status(500).json({ message: 'Error suggesting skills', error: error.message });
    }
  })
);

// Generate Image Route
router.post(
  '/generate-image',
  asyncHandler(async (req, res) => {
    const { name, gender, skills } = req.body;

    console.log('Generating AI Image');
    const imagePrompt = `Photorealistic portrait of a ${gender} named ${name}, expert in ${skills}.`;

    try {
      const response = await openai.images.generate({
        prompt: imagePrompt,
        n: 1,
        size: '256x256',
        response_format: 'url',
      });

      const imageUrl = response.data[0].url;
      console.log('Image URL:', imageUrl);

      // Download the image and save it to the uploads directory
      const imageResponse = await fetch(imageUrl);
      const buffer = await imageResponse.buffer();
      const filename = `ai-image-${Date.now()}.png`;
      const imageSavePath = path.join('uploads', filename);

      await fs.writeFile(imageSavePath, buffer);

      res.json({ imagePath: filename });
    } catch (imageError) {
      console.error('Error generating AI image:', imageError);
      res
        .status(500)
        .json({ message: 'Error generating AI image', error: imageError.message });
    }
  })
);

export default router;
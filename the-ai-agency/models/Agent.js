// models/Agent.js

import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    image: {
      type: String,
    },
    aiGeneratedImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Agent = mongoose.model('Agent', AgentSchema);

export default Agent;

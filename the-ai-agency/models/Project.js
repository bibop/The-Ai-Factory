import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }],
  tasks: [{
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
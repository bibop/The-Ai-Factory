import express from 'express';
import Project from '../models/Project.js';
import Agent from '../models/Agent.js';

const router = express.Router();

console.log('Project routes loaded');

// Create a new project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('agents');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('agents');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Update a project
router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('agents');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Invoke a team for a project
router.post('/:id/invoke-team', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Logic to invoke a team (this is a placeholder and should be replaced with actual AI logic)
    const availableAgents = await Agent.find();
    const selectedAgents = availableAgents.slice(0, 3); // Select first 3 agents as an example

    project.agents = selectedAgents.map(agent => agent._id);
    await project.save();

    res.json({ message: 'Team invoked successfully', agents: selectedAgents });
  } catch (error) {
    console.error('Error invoking team:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

export default router;
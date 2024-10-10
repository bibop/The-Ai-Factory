import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ProjectForm from './ProjectForm';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  return (
    <div>
      <h2>Projects</h2>
      <Button onClick={() => setShowModal(true)}>Create New Project</Button>
      {projects.map((project) => (
        <Card key={project._id} className="mb-3">
          <Card.Body>
            <Card.Title>{project.name}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
            <Button variant="primary">Edit</Button>
            <Button variant="danger">Delete</Button>
          </Card.Body>
        </Card>
      ))}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm onProjectCreated={handleProjectCreated} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectList;
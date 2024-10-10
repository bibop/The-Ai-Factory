import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import AgentForm from './components/AgentForm';
import AgentList from './components/AgentList';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ErrorFallback from './components/ErrorFallback'; // Import your ErrorFallback component
import { ErrorBoundary } from 'react-error-boundary'; // Import ErrorBoundary from the library
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/agents`);
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAgents();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              AI Agency
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/projects">
                  Project Editor
                </Nav.Link>
                <Nav.Link as={Link} to="/agents">
                  Agent Editor
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <Container className="mt-4">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center mt-5">
                    <h1>Welcome to AI Agency</h1>
                    <p>Select an option from the menu to get started.</p>
                  </div>
                }
              />
              <Route
                path="/agents"
                element={
                  <>
                    <h2 className="mb-4">AI Agents Editor</h2>
                    <AgentForm onAgentCreated={fetchAgents} />
                    <AgentList agents={agents} />
                  </>
                }
              />
              <Route
                path="/projects"
                element={
                  <>
                    <h2 className="mb-4">Project Editor</h2>
                    <ProjectForm onProjectCreated={fetchProjects} />
                    <ProjectList projects={projects} />
                  </>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Container>
      </div>
    </Router>
  );
}

export default App;
// src/components/AgentList.jsx

import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

const AgentList = ({ agents = [] }) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <Container>
      {agents.length > 0 ? (
        <Row>
          {agents.map((agent) => (
            <Col key={agent._id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="h-100">
                {(agent.image || agent.aiGeneratedImage) && (
                  <Card.Img
                    variant="top"
                    src={`${baseURL}/uploads/${agent.aiGeneratedImage || agent.image}`}
                    alt={agent.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{agent.name}</Card.Title>
                  <Card.Text>Gender: {agent.gender}</Card.Text>
                  <Card.Text>Skills: {agent.skills.join(', ')}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No agents found.</p>
      )}
    </Container>
  );
};

export default AgentList;
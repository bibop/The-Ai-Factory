// src/components/AgentForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Form, Button, InputGroup, Image } from 'react-bootstrap';

const AgentForm = ({ onAgentCreated }) => {
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      skills: '',
      generateAIImage: false,
      imageFile: null,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('gender', values.gender);
        formData.append('skills', values.skills);
        formData.append('generateAIImage', values.generateAIImage);

        if (!values.generateAIImage && values.imageFile) {
          formData.append('image', values.imageFile);
        }

        const response = await axios.post(`${baseURL}/api/agents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Agent created:', response.data);

        // Set the generated description
        setGeneratedDescription(response.data.description);

        // Reset the form
        resetForm();
        setImagePreview(null);
        setSuggestedSkills([]);

        // Refresh the agent list
        if (onAgentCreated) {
          onAgentCreated();
        }
      } catch (error) {
        console.error('Error creating agent:', error.response.data);
      }
    },
  });

  // Randomly select gender on component mount
  useEffect(() => {
    const genders = ['male', 'female'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    formik.setFieldValue('gender', randomGender);
  }, []);

  // Handle image file selection
  const handleImageChange = (event) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      formik.setFieldValue('imageFile', event.currentTarget.files[0]);

      // For image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(event.currentTarget.files[0]);
    }
  };

  const handleSuggestName = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/agents/suggest-name`);
      formik.setFieldValue('name', response.data.name);
    } catch (error) {
      console.error('Error suggesting name:', error);
    }
  };

  const handleSuggestSkills = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/agents/suggest-skills`, {
        name: formik.values.name,
        gender: formik.values.gender,
      });
      setSuggestedSkills(response.data.skills);
    } catch (error) {
      console.error('Error suggesting skills:', error);
    }
  };

  // Generate AI image when skills change
  useEffect(() => {
    if (formik.values.skills && formik.values.generateAIImage) {
      generateAIImage();
    }
  }, [formik.values.skills, formik.values.generateAIImage]);

  const generateAIImage = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/agents/generate-image`, {
        name: formik.values.name,
        gender: formik.values.gender,
        skills: formik.values.skills,
      });

      setImagePreview(`${baseURL}/uploads/${response.data.imagePath}`);
      // Set a flag to indicate that an AI-generated image is used
      formik.setFieldValue('generateAIImage', true);
    } catch (error) {
      console.error('Error generating AI image:', error);
    }
  };

  return (
    <div>
      <h2>Create Agent</h2>
      <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <InputGroup>
            <Form.Control
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              required
            />
            <Button variant="secondary" onClick={handleSuggestName}>
              Suggest a Name
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender:</Form.Label>
          <Form.Control
            as="select"
            id="gender"
            name="gender"
            onChange={formik.handleChange}
            value={formik.values.gender}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skills:</Form.Label>
          <InputGroup>
            <Form.Control
              id="skills"
              name="skills"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.skills}
              placeholder="e.g., Programming, Design"
              required
            />
            <Button variant="secondary" onClick={handleSuggestSkills}>
              Suggest Skills
            </Button>
          </InputGroup>
          {suggestedSkills.length > 0 && (
            <div className="mt-2">
              {suggestedSkills.map((skill, index) => (
                <Form.Check
                  inline
                  key={index}
                  type="checkbox"
                  id={`skill-${index}`}
                  label={skill}
                  value={skill}
                  checked={formik.values.skills.includes(skill)}
                  onChange={(e) => {
                    const skillsArray = formik.values.skills
                      ? formik.values.skills.split(',').map((s) => s.trim())
                      : [];
                    if (e.target.checked) {
                      if (!skillsArray.includes(skill)) {
                        skillsArray.push(skill);
                      }
                    } else {
                      const idx = skillsArray.indexOf(skill);
                      if (idx > -1) {
                        skillsArray.splice(idx, 1);
                      }
                    }
                    formik.setFieldValue('skills', skillsArray.join(', '));
                  }}
                />
              ))}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="generateAIImage"
            name="generateAIImage"
            label="Generate AI Image"
            checked={formik.values.generateAIImage}
            onChange={formik.handleChange}
          />
        </Form.Group>

        {!formik.values.generateAIImage && (
          <Form.Group className="mb-3">
            <Form.Label>Upload Image:</Form.Label>
            <Form.Control
              id="image"
              name="imageFile"
              type="file"
              onChange={handleImageChange}
            />
            {imagePreview && <Image src={imagePreview} thumbnail width="200" />}
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          Create Agent
        </Button>
      </Form>

      {generatedDescription && (
        <div className="mt-4">
          <h3>Generated Description:</h3>
          <p>{generatedDescription}</p>
        </div>
      )}
    </div>
  );
};

export default AgentForm;
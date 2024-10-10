import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const ProjectForm = ({ onProjectCreated }) => {
  const initialValues = {
    name: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Project name is required'),
    description: Yup.string().required('Project description is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, values);
      if (onProjectCreated) {
        onProjectCreated(response.data);
      }
      resetForm({});
    } catch (error) {
      console.error('Error creating project:', error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h3>Create Project</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Project Name</label>
              <Field name="name" type="text" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <Field name="description" as="textarea" rows="3" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              Create Project
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProjectForm;
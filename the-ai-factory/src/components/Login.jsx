import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // State to hold CSRF token
  const navigate = useNavigate();

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf/');
        setCsrfToken(response.data.csrfToken); // Save CSRF token in state
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { email, password },
        {
          headers: {
            'X-CSRFToken': csrfToken, // Attach CSRF token to the headers
          },
          withCredentials: true,
        }
      );

      // Store the token in local storage for later use
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      console.log('Login successful:', response.data.message);
      navigate('/dashboard');  // Redirect to dashboard or any page after login
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data.message : err.message);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
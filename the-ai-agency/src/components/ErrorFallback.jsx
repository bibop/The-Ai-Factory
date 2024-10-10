// src/components/ErrorFallback.jsx

import React from 'react';

const ErrorFallback = ({ error }) => (
  <div>
    <h2>An error occurred:</h2>
    <pre>{error.message}</pre>
  </div>
);

export default ErrorFallback;

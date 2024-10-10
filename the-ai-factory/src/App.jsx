import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>The AI Factory</h1>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h2>Welcome to The AI Factory</h2>} />
      </Routes>
    </div>
  );
}

export default App;
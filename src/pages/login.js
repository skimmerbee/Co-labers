// login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // Importing the useCookies hook
import './index.css';

const Login = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate(); // Hook for navigation
  const [cookies, setCookie] = useCookies(['user']); // Cookie management

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // Send login request to the server
      const response = await fetch('https://co-laber.vercel.app/server/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Send email and password
        credentials: 'include' // Include credentials for CORS
      });

      const result = await response.json(); // Parse JSON response

      if (response.ok) {
        // On successful login, set cookie with username
        setCookie('user', result.username, { path: '/' });
        navigate('/main'); // Navigate to the main page
      } else {
        // Set error message for failed login
        setErrorMessage(result.message || 'Login failed.');
      }
    } catch (error) {
      // Handle any errors during the fetch
      setErrorMessage('System malfunction: Unable to connect to the matrix.');
    }
  };

  return (
    <div className="form">
      <h2>Co-lab</h2>
      <h3>Find your whimsical</h3>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="i"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />
        <input
          className="i"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <button type="submit" className="button-56">Login</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>} 
      <p>Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register here</span></p>
    </div>
  );
};

export default Login;

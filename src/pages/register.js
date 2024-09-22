import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // Importing the useCookies hook
import './index.css'; // Import your styles

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' }); // State for form data
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State to manage loading status
  const navigate = useNavigate(); // Hook for navigation
  const [cookies, setCookie] = useCookies(['user']); // Cookie management

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error state

    // Avoid multiple submissions while still loading
    if (loading) return;

    const { username, email, password } = formData;

    // Basic validation
    if (!username || !email || !password) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true); // Prevent multiple submits
    try {
      // Send registration request to the server
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        // On successful registration, set cookie with username
        setCookie('user', username, { path: '/' });
        // Navigate to the main page with the username
        navigate(`/edit-profile/${username}`, { replace: true });
      } else {
        const errorMessage = await response.text(); // Get error message from response
        setError(errorMessage); // Set error message
      }
    } catch (error) {
      // Handle unexpected errors
      setError('An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data
  };

  return (
    <div className="form"> {/* Use className for styling */}
      <h2>Co-lab</h2>
      <h3>Find your whimsical</h3>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="i" // Use the same class as in Login
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <br />
        <input
          className="i" // Use the same class as in Login
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <br />
        <input
          className="i" // Use the same class as in Login
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit" className="button-56" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display error message if present */}
      <p>
        Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span>
      </p>
    </div>
  );
};

export default Register;

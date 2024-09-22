const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors({ origin: 'https://your-vercel-deployment-url.vercel.app', credentials: true }));
app.use(bodyParser.json());

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable
});

// Check username availability endpoint
app.get('/check-username', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Username is required.');
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      return res.status(409).send('Username is already taken.');
    }

    res.status(200).send('Username is available.');
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).send('Server error occurred while checking username.');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      const username = result.rows[0].username;
      res.status(200).json({ username });
    } else {
      res.status(401).send('Invalid email or password.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error occurred during login.');
  }
});

// Profile endpoint
app.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE username = $1',
      [username]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Profile not found.');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error occurred while fetching the profile.');
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).send('Username is already taken.');
    }

    const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(409).send('Email is already in use.');
    }

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, password]
    );

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error occurred during registration.');
  }
});

app.get('/tags', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM tags');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tags:', err.message);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

app.post('/addpost', async (req, res) => {
  const { username, content, tags, date_posted } = req.body;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    const userId = userResult.rows[0].id;

    const dateTimeSuffix = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 5);
    const uniqueId = `${userId}${dateTimeSuffix}`; // Corrected string interpolation

    let tagsArray;
    try {
      tagsArray = tags ? JSON.parse(tags) : [];
    } catch (err) {
      console.error('Error parsing tags:', err);
      tagsArray = [];
    }

    const result = await pool.query(
      'INSERT INTO tiles (id, username, content, tags, date_posted) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uniqueId, username, content, tagsArray.length ? tagsArray : '', date_posted]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to add post' });
  }
});

// Other endpoints...

app.get('/tiles/tag/:tag', async (req, res) => {
  const { tag } = req.params;

  try {
    const query = 'SELECT * FROM tiles WHERE tags = $1 ORDER BY date_posted DESC';
    const result = await pool.query(query, [tag]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tiles by tag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tiles/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const query = 'SELECT * FROM tiles WHERE username::text = $1 ORDER BY date_posted DESC';
    const result = await pool.query(query, [username]);
    
    console.log('Tiles retrieved:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tiles by username:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tiles ORDER BY date_posted DESC;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit post endpoint
app.put('/edit-post', async (req, res) => {
  const { username, bio, tags, location, contact } = req.body;

  if (!username || !bio || !tags || !location || !contact) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    const userId = userResult.rows[0].id;

    const profileResult = await pool.query('SELECT * FROM user_profiles WHERE id = $1', [userId]);

    if (profileResult.rows.length > 0) {
      await pool.query(
        'UPDATE user_profiles SET bio = $1, tags = $2, location = $3, contact_info = $4 WHERE userid = $5',
        [bio, tags, location, contact, userId]
      );
      return res.status(200).send('Profile updated successfully.');
    } else {
      await pool.query(
        'INSERT INTO user_profiles (id, username, bio, tags, location, contact_info) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, username, bio, tags, location, contact]
      );
      return res.status(201).send('Profile created successfully.');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Server error occurred while processing the request.');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the app for Vercel

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Users', // Ensure the database name is lowercase
  password: '123',
  port: 5432,
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

/*
app.post('/addpost', async (req, res) => {
  const { username, content, tags, date_posted } = req.body;

  try {
      const query = 'INSERT INTO tiles (username, content, tags, date_posted) VALUES ($1, $2, $3, $4)';
      await pool.query(query, [username, content, tags, date_posted]);
      res.status(201).json({ message: 'Post added successfully!' });
  } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).json({ error: 'Failed to add post' });
  }
});

*/

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
  const { username } = req.params;

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
    // Fetch the user ID from the users table
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    const userId = userResult.rows[0].id; // Use a clear variable name for the user ID

    // Check if the user profile exists
    const profileResult = await pool.query('SELECT * FROM user_profiles WHERE id = $1', [userId]);

    if (profileResult.rows.length > 0) {
      // Update the existing profile
      await pool.query(
        'UPDATE user_profiles SET bio = $1, tags = $2, location = $3, contact_info = $4 WHERE userid = $5',
        [bio, tags, location, contact, userId]
      );
      return res.status(200).send('Profile updated successfully.');
    } else {
      // Create a new profile if it does not exist
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
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});



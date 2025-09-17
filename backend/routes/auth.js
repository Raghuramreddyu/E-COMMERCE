const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// ... (register route is unchanged) ...
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { return res.status(400).json({ message: 'Email and password are required.' }); }
  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) { return res.status(400).json({ message: 'User already exists.' }); }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const [result] = await db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, password_hash]);
    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Email and password are required.' }); }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) { return res.status(401).json({ message: 'Invalid credentials.' }); }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) { return res.status(401).json({ message: 'Invalid credentials.' }); }

        const payload = { 
          userId: user.id, 
          isAdmin: user.role === 'admin'
        };

        // --- DEBUG STEP 1 ---
        console.log('--- Step 1: Creating Token ---');
        console.log('Payload being put INTO token:', payload);
        // --------------------

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// ... (admin login route is unchanged) ...
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET } = process.env;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ userId: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, email: 'admin' });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials.' });
    }
});

module.exports = router;


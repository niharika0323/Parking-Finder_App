// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import User model
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user
        await newUser.save();
        res.status(201).json({ success: true, msg: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // ✅ email added here
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
          );

        res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

module.exports = router;

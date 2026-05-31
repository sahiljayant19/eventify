const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        error: 'Email, password and username are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = new User({
      email: email.toLowerCase(),
      username,
      passwordHash
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      id: savedUser._id,
      email: savedUser.email,
      username: savedUser.username
    });

  } catch (error) {
    console.error("❌ Database error (register):", error.message);
    
    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error("❌ Database error (login):", error.message);

    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login
};
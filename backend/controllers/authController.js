const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db');

const register = async (req, res) => {

  try {

    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        error: 'Email, password and username are required'
      });
    }

    // Check if user exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {

        if (err) {
          console.error("❌ Database query error (register/check):", err.message);
          console.error("Error Code:", err.code);
          return res.status(500).json({
            error: 'Database error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            error: 'Email already registered'
          });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user
        db.query(
          'INSERT INTO users (email, username, passwordHash) VALUES (?, ?, ?)',
          [email, username, passwordHash],
          (err, result) => {

            if (err) {
              console.error("❌ Database query error (register/insert):", err.message);
              console.error("Error Code:", err.code);
              return res.status(500).json({
                error: 'Database error',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
              });
            }

            res.status(201).json({
              id: result.insertId,
              email,
              username
            });

          }
        );

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
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

    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {

        if (err) {
          console.error("❌ Database query error (login):", err.message);
          console.error("Error Code:", err.code);

          return res.status(500).json({
            error: 'Database error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }

        if (results.length === 0) {
          return res.status(401).json({
            error: 'Invalid credentials'
          });
        }

        const user = results[0];

        // Check password
        const isValidPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return res.status(401).json({
            error: 'Invalid credentials'
          });
        }

        // Generate token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }

};

module.exports = {
  register,
  login
};
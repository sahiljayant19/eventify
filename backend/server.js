require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

const PORT = process.env.PORT || 8080;

// Allowed frontend URLs
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware
// app.use(cors({
//   origin: function (origin, callback) {

//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(new Error('Not allowed by CORS'));
//   }
// }));
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Eventify Backend is running'
  });
});

// Global error handler
app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    error: err.message || 'Something went wrong'
  });

});

// Start server
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
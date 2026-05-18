const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

// POST /api/bookings
router.post('/', createBooking);

// GET /api/bookings
router.get('/', getBookings);

// GET /api/bookings/:id
router.get('/:id', getBookingById);

// DELETE /api/bookings/:id
router.delete('/:id', deleteBooking);

module.exports = router;

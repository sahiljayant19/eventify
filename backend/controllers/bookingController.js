const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createBooking = async (req, res) => {
  try {
    const {
      eventName,
      eventMeta,
      tickets,
      pricePerTicket,
      totalAmount,
      userId
    } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        message: 'A valid user ID is required',
        bookingId: null
      });
    }

    // Check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        bookingId: null
      });
    }

    // Create booking
    const newBooking = new Booking({
      eventName,
      eventMeta,
      tickets,
      pricePerTicket,
      totalAmount,
      userId
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: savedBooking._id.toString()
    });

  } catch (error) {
    console.error("❌ Database error (create booking):", error.message);

    res.status(500).json({
      message: 'Database error',
      bookingId: null,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = {};

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({
          error: 'A valid user ID is required'
        });
      }

      filter = { userId };
    }

    const bookings = await Booking.find(filter).populate('userId', 'username email');

    res.json(bookings);

  } catch (error) {
    console.error("❌ Database error (get bookings):", error.message);

    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!isValidObjectId(bookingId)) {
      return res.status(400).json({
        error: 'A valid booking ID is required'
      });
    }

    const booking = await Booking.findById(bookingId).populate('userId', 'username email');

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.json(booking);

  } catch (error) {
    console.error("❌ Database error (get booking):", error.message);

    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!isValidObjectId(bookingId)) {
      return res.status(400).json({
        error: 'A valid booking ID is required'
      });
    }

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.status(204).send();

  } catch (error) {
    console.error("❌ Database error (delete booking):", error.message);

    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking
};

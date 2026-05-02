const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

const createBooking = async (req, res) => {
  try {
    const { eventName, eventMeta, tickets, pricePerTicket, totalAmount, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required. Please log in.',
        bookingId: null
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        bookingId: null
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        eventName,
        eventMeta,
        tickets: parseInt(tickets),
        pricePerTicket: parseFloat(pricePerTicket),
        totalAmount: parseFloat(totalAmount),
        userId: parseInt(userId)
      }
    });

    const message = `Booking created for ${booking.eventName} (${booking.tickets} tickets, total $${booking.totalAmount})`;

    res.status(201).json({
      message,
      bookingId: booking.id.toString()
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      message: 'Internal server error',
      bookingId: null
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    let bookings;

    if (userId) {
      // Get bookings for specific user
      bookings = await prisma.booking.findMany({
        where: { userId: parseInt(userId) },
        include: { user: true }
      });
    } else {
      // Get all bookings (fallback)
      bookings = await prisma.booking.findMany({
        include: { user: true }
      });
    }

    res.json(bookings);

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send();
    }

    const bookingId = parseInt(id);

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).send();
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    res.status(204).send();

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking
};
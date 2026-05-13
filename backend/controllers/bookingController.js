const db = require('../db');

const createBooking = (req, res) => {

  try {

    const {
      eventName,
      eventMeta,
      tickets,
      pricePerTicket,
      totalAmount,
      userId
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
        bookingId: null
      });
    }

    // Check user exists
    db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId],
      (err, userResults) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            message: 'Database error',
            bookingId: null
          });
        }

        if (userResults.length === 0) {
          return res.status(404).json({
            message: 'User not found',
            bookingId: null
          });
        }

        // Create booking
        db.query(
          `INSERT INTO bookings
          (eventName, eventMeta, tickets, pricePerTicket, totalAmount, userId)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            eventName,
            eventMeta,
            tickets,
            pricePerTicket,
            totalAmount,
            userId
          ],
          (err, result) => {

            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Database error',
                bookingId: null
              });
            }

            res.status(201).json({
              message: 'Booking created successfully',
              bookingId: result.insertId.toString()
            });

          }
        );

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Internal server error',
      bookingId: null
    });

  }

};

const getBookings = (req, res) => {

  try {

    const { userId } = req.query;

    let query = `
      SELECT bookings.*, users.username, users.email
      FROM bookings
      JOIN users ON bookings.userId = users.id
    `;

    const values = [];

    if (userId) {
      query += ' WHERE bookings.userId = ?';
      values.push(userId);
    }

    db.query(query, values, (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'Database error'
        });
      }

      res.json(results);

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }

};

const getBookingById = (req, res) => {

  try {

    const bookingId = req.params.id;

    db.query(
      `SELECT bookings.*, users.username, users.email
       FROM bookings
       JOIN users ON bookings.userId = users.id
       WHERE bookings.id = ?`,
      [bookingId],
      (err, results) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            error: 'Database error'
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            error: 'Booking not found'
          });
        }

        res.json(results[0]);

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }

};

const deleteBooking = (req, res) => {

  try {

    const bookingId = req.params.id;

    db.query(
      'DELETE FROM bookings WHERE id = ?',
      [bookingId],
      (err, result) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            error: 'Database error'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).send();
        }

        res.status(204).send();

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
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking
};
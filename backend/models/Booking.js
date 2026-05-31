const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required']
    },
    eventMeta: {
      type: String,
      default: null
    },
    tickets: {
      type: Number,
      required: [true, 'Number of tickets is required'],
      min: 1
    },
    pricePerTicket: {
      type: Number,
      required: [true, 'Price per ticket is required'],
      min: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // made optional
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);

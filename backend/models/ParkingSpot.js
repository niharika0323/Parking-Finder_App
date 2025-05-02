const mongoose = require('mongoose');

// Define the schema for parking spot
const spotSchema = new mongoose.Schema({
  name: String,
  city: String,
  latitude: Number,
  longitude: Number,
  totalSlots: Number,
  availableSlots: Number
});

// Prevent overwriting the model if it already exists
const Spot = mongoose.models.Spot || mongoose.model('Spot', spotSchema);

module.exports = Spot;

const mongoose = require('mongoose');

// Replace this with your actual MongoDB connection string
const mongoURI = 'mongodb+srv://Niharika:arpit@cluster0.er3b1tp.mongodb.net/';

// Define your Parking Spot Schema
const spotSchema = new mongoose.Schema({
  name: String,
  city: String,
  latitude: Number,
  longitude: Number,
  totalSlots: Number,
  availableSlots: Number,
});

// Create the Model
const Spot = mongoose.model('Spot', spotSchema);

// Data to Insert
const parkingSpots = [
  {
    name: "Clock Tower Parking",
    city: "Dehradun",
    latitude: 30.3244,
    longitude: 78.0330,
    totalSlots: 50,
    availableSlots: 20
  },
  {
    name: "Paltan Bazaar Parking",
    city: "Dehradun",
    latitude: 30.3170,
    longitude: 78.0322,
    totalSlots: 100,
    availableSlots: 60
  },
  {
    name: "Rajpur Road Parking",
    city: "Dehradun",
    latitude: 30.3451,
    longitude: 78.0800,
    totalSlots: 80,
    availableSlots: 35
  },
  {
    name: "Pacific Mall Parking",
    city: "Dehradun",
    latitude: 30.3568,
    longitude: 78.0801,
    totalSlots: 120,
    availableSlots: 75
  },
  {
    name: "ISBT Dehradun Parking",
    city: "Dehradun",
    latitude: 30.2709,
    longitude: 78.0081,
    totalSlots: 150,
    availableSlots: 95
  },
  {
    name: "Sahastradhara Road Parking",
    city: "Dehradun",
    latitude: 30.3873,
    longitude: 78.1218,
    totalSlots: 70,
    availableSlots: 40
  },
  {
    name: "Graphic Era University Parking",
    city: "Dehradun",
    latitude: 30.2715,
    longitude: 78.0792,
    totalSlots: 60,
    availableSlots: 30
  }
];

// Insert Data
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected!');
    await Spot.insertMany(parkingSpots);
    console.log('Parking Spots Inserted Successfully!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting or inserting:', err);
    mongoose.disconnect();
  });

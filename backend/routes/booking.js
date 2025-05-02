const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');  // For token verification
const ParkingSpot = require('../models/ParkingSpot');
const Booking = require('../models/Booking');
const User = require('../models/User');
const sendBookingEmail = require('../utils/mailer');

// Book a spot
router.post('/', async (req, res) => {
  console.log('📥 Booking Request Body:', req.body);

  const { spotName, userEmail, token, date, time } = req.body;

  try {
    // Check for missing data
    if (!spotName || !userEmail || !token) {
      return res.status(400).json({ message: 'Missing spot name, user email, or token' });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Use the value from .env
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ email: userEmail });
    console.log('👤 User Found:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Case-insensitive match for spot name
    const spot = await ParkingSpot.findOne({ name: new RegExp(`^${spotName}$`, 'i') });
    console.log('🔍 Spot Found:', spot);

    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    // Check if the spot is already booked for the selected date and time
    const existingBooking = await Booking.findOne({ spotId: spot._id, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'Spot already booked for this date and time' });
    }

    // Create new booking
    const newBooking = new Booking({
      userId: user._id,
      spotId: spot._id,
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Save the booking to the database
    await newBooking.save();

    // Send booking confirmation email
    await sendBookingEmail(userEmail, {
      name: user.username,
      bookingId: newBooking._id,
      spotName,
      city: spot.city,
      date: newBooking.date,
      time: newBooking.time,
    });

    // Respond with booking confirmation
    res.status(201).json({
      message: 'Booking successful!',
      bookingId: newBooking._id,
      spotName,
      bookingDate: newBooking.date,
      bookingTime: newBooking.time,
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error during booking' });
  }
});

// Get all bookings (New route)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId spotId');  // Optional: Populate user and spot details
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

module.exports = router;

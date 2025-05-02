const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/ParkingSpot');

// GET all spots
router.get('/', async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});

// POST a new spot
router.post('/', async (req, res) => {
  try {
    const newSpot = new ParkingSpot(req.body);
    await newSpot.save();
    res.status(201).json(newSpot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add spot' });
  }
});

module.exports = router;

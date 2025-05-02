// 📄 src/components/BookingHistory.js

import React, { useEffect, useState } from 'react';
import API from '../api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch booking history:', err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Booking History</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="p-4 border rounded shadow">
              <p><strong>Spot:</strong> {booking.spotId?.name}</p>
              <p><strong>City:</strong> {booking.spotId?.city}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;

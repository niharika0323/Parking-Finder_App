// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingHistory from './components/BookingHistory';
import AddParkingSpot from './components/AddParkingSpot';
import ProtectedRoute from './components/ProtectedRoute'; // Important for auth
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-spot"
        element={
          <ProtectedRoute>
            <AddParkingSpot />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route: if no path matches */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

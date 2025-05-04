import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

function Dashboard() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [loadingSpotId, setLoadingSpotId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await axios.get('https://parking-finder-app-gaia.onrender.com/api/spots');
      setParkingSpots(res.data);
      setFilteredSpots(res.data);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
    }
  };

  const handleBooking = async (spot) => {
    const confirmBooking = window.confirm('Do you want to book this spot?');
    if (!confirmBooking) return;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please log in to book a spot.');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.email;

      setLoadingSpotId(spot._id);

      await axios.post(
        'https://parking-finder-app-gaia.onrender.com/api/booking',
        {
          spotName: spot.name,
          userEmail,
          token,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Booking successful!');
      fetchSpots();
    } catch (err) {
      console.error('Error booking spot:', err);
      if (err.response) {
        toast.error(`Booking failed: ${err.response.data.message || 'Try again.'}`);
      } else {
        toast.error('Booking failed. Try again.');
      }
    } finally {
      setLoadingSpotId(null);
    }
  };

  const handleSearch = useCallback(() => {
    const query = searchQuery.toLowerCase();
    const filtered = parkingSpots.filter(spot =>
      spot.city.toLowerCase().includes(query) ||
      spot.name.toLowerCase().includes(query)
    );
    setFilteredSpots(filtered);
  }, [searchQuery, parkingSpots]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const customMarkerIcon = (availableSlots) => {
    return new L.Icon({
      iconUrl: availableSlots > 0
        ? 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
        : 'https://cdn-icons-png.flaticon.com/512/684/684908-gray.png',
      iconSize: [35, 35],
    });
  };

  return (
    
      <div className="app-wrapper">
    
      <ToastContainer />

      {/* Sidebar */}
      <div className="sidebar">

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '15px'
          }}
        >
          Logout
        </button>

        <h2 style={{ textAlign: 'center' }}>Parking Spots</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by city or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />

        {filteredSpots.length === 0 && <p>No spots found.</p>}

        {filteredSpots.map((spot) => (
          <div key={spot._id} style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}>
            <h3 style={{ margin: '0 0 10px' }}>{spot.name}</h3>
            <p style={{ margin: '0 0 5px' }}><strong>City:</strong> {spot.city}</p>
            <p style={{ margin: '0 0 10px' }}>
              <strong>Slots:</strong> {spot.availableSlots}/{spot.totalSlots}
            </p>

            {spot.availableSlots > 0 ? (
              <button
                onClick={() => handleBooking(spot)}
                disabled={loadingSpotId === spot._id}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {loadingSpotId === spot._id ? 'Booking...' : 'Book Now'}
              </button>
            ) : (
              <button
                disabled
                style={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  width: '100%',
                }}
              >
                No Slots
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="map-area">

        <MapContainer center={[30.3244, 78.0330]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {filteredSpots.map((spot) => (
            <Marker
              key={spot._id}
              position={[spot.latitude, spot.longitude]}
              icon={customMarkerIcon(spot.availableSlots)}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '5px 0' }}>{spot.name}</h3>
                  <p style={{ margin: '5px 0' }}>{spot.city}</p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Slots:</strong> {spot.availableSlots}/{spot.totalSlots}
                  </p>

                  {spot.availableSlots > 0 ? (
                    <button
                      onClick={() => handleBooking(spot)}
                      disabled={loadingSpotId === spot._id}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '5px',
                      }}
                    >
                      {loadingSpotId === spot._id ? 'Booking...' : 'Book Now'}
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        backgroundColor: 'gray',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        marginTop: '5px',
                      }}
                    >
                      No Slots Available
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Dashboard;

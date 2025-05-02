import { useState } from 'react';
import axios from 'axios';

function AddParkingSpot() {
  const [spotData, setSpotData] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: '',
    totalSlots: 0,
    availableSlots: 0,
  });

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSpotData((prevData) => ({
        ...prevData,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    }, (error) => {
      console.error('Error getting location:', error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/spots', spotData);
    alert('Spot added successfully!');
  };

  return (
    <div>
      <h2>Add Parking Spot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={spotData.name}
          onChange={(e) => setSpotData({ ...spotData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={spotData.city}
          onChange={(e) => setSpotData({ ...spotData, city: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Total Slots"
          value={spotData.totalSlots}
          onChange={(e) => setSpotData({ ...spotData, totalSlots: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Available Slots"
          value={spotData.availableSlots}
          onChange={(e) => setSpotData({ ...spotData, availableSlots: e.target.value })}
          required
        />
        <button type="button" onClick={getCurrentLocation}>
          Use Current Location
        </button>
        <button type="submit">Add Spot</button>
      </form>
      <p>Latitude: {spotData.latitude}</p>
      <p>Longitude: {spotData.longitude}</p>
    </div>
  );
}

export default AddParkingSpot;

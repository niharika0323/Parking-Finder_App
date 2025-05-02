// MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

function CurrentLocationButton() {
  const map = useMap();

  const locate = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 16);
    });
  };

  return (
    <button
      onClick={locate}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '8px 12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      📍 Use My Location
    </button>
  );
}

function SearchBar() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: true,
      showPopup: true,
      popupFormat: ({ query, result }) => result.label,
      maxMarkers: 1,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address...'
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

const MapView = ({ spots, handleBooking, loadingSpotId }) => (
  <div style={{ position: 'relative', height: '400px', width: '100%' }}>
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((spot) => (
        <Marker key={spot._id} position={[spot.latitude, spot.longitude]}>
          <Popup>
            <div>
              <strong>{spot.name}</strong> ({spot.city})
              <br />
              <strong>Slots:</strong> {spot.availableSlots}/{spot.totalSlots}
              <br />
              {spot.availableSlots > 0 ? (
                <button
                  onClick={() => handleBooking(spot._id, spot.name)}
                  style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {loadingSpotId === spot._id ? 'Booking...' : 'Book Now'}
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    backgroundColor: 'gray',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'not-allowed'
                  }}
                >
                  No Slots Available
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <CurrentLocationButton />
      <SearchBar />
    </MapContainer>
  </div>
);

export default MapView;

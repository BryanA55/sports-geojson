import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import './map.css';

const Map = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/mlb-stadiums.json')
      .then((res) => res.json())  // Use .json() instead of .text()
      .then((json) => {
        console.log(json);  // Check if the JSON is correct in the console
        setGeoData(json);   // Set the GeoJSON data
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));  // Log any errors
  }, []);
  
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const logoUrl = feature.properties.logo;
  
      if (logoUrl) {
        const customIcon = L.icon({
          iconUrl: logoUrl || '/default-pin.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
  
        layer.setIcon(customIcon);
      }
  
      const popupContent = `
        <strong>${feature.properties.name}</strong><br />
        Team: ${feature.properties.team}
      `;
      layer.bindPopup(popupContent);
    }
  };
  

  return (
    <div className="map-container">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};

export default Map;

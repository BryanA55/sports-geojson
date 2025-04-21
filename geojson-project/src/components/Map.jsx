import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import './map.css';
import StadiumModal from './StadiumModal';

const Map = () => {
  const [geoData, setGeoData] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetch('/mlb-stadiums.json')
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setGeoData(json);
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const logoUrl = feature.properties.logo;

      if (logoUrl) {
        const customIcon = L.icon({
          iconUrl: logoUrl,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        layer.setIcon(customIcon);
      }

      layer.on('click', () => {
        setModalData({
          name: feature.properties.name,
          team: feature.properties.team,
          logo: feature.properties.logo,
          stadium: feature.properties.stadium,
          credit: feature.properties.credit
        });
      });
    }
  };

  return (
    <div className="map-container">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />}
      </MapContainer>

      <StadiumModal
        show={!!modalData}
        onHide={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};

export default Map;

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import './map.css';
import StadiumModal from './StadiumModal';
import { Form, InputGroup, ListGroup, Button, ButtonGroup } from 'react-bootstrap';

const Map = () => {
  const [geoData, setGeoData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("all");

  useEffect(() => {
    fetch('/mlb-stadiums.json')
      .then((res) => res.json())
      .then((json) => {
        setGeoData(json);
        setFilteredData(json);
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(() => {
    if (geoData) {
      const filteredByLeague = geoData.features.filter((feature) => {
        if (selectedLeague === "AL") return feature.properties.league === "AL";
        if (selectedLeague === "NL") return feature.properties.league === "NL";
        return true;
      });

      const filteredFeatures = filteredByLeague.filter((feature) =>
        feature.properties.team.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredFeatures);
      setFilteredData({ ...geoData, features: filteredFeatures });
    }
  }, [searchTerm, selectedLeague, geoData]);

  const handleSearchSelect = (feature) => {
    setModalData({
      name: feature.properties.name,
      team: feature.properties.team,
      logo: feature.properties.logo,
      stadium: feature.properties.stadium,
      link: feature.properties.link,
      credit: feature.properties.credit,
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    }
  };

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
          link: feature.properties.link,
          credit: feature.properties.credit,
        });
      });
    }
  };

  const handleLeagueFilter = (league) => {
    setSelectedLeague(league);
  };

  // Download stadium data as plain text with no header and extra space after each stadium
  const downloadText = () => {
    if (!filteredData) return;

    // Map each stadium to a tab-separated line, then add an extra newline for spacing
    const lines = filteredData.features.map((f) => {
      const p = f.properties;
      return `${p.name || ""}\t${p.team || ""}\t${p.league || ""}\n`;
    });

    // Join lines with an additional newline between each stadium line
    const dataStr = lines.join("\n");

    const blob = new Blob([dataStr], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stadium-data.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="map-container">
      <div className="filter-buttons mb-2">
        <ButtonGroup aria-label="League filter">
          <Button
            variant={selectedLeague === "AL" ? "primary" : "secondary"}
            onClick={() => handleLeagueFilter("AL")}
          >
            American League
          </Button>
          <Button
            variant={selectedLeague === "NL" ? "primary" : "secondary"}
            onClick={() => handleLeagueFilter("NL")}
          >
            National League
          </Button>
          <Button
            variant={selectedLeague === "all" ? "primary" : "secondary"}
            onClick={() => handleLeagueFilter("all")}
          >
            All Teams
          </Button>
        </ButtonGroup>

        <Button variant="success" onClick={downloadText} className="ms-3">
          Download Stadium Data
        </Button>
      </div>

      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredData && (
          <GeoJSON
            data={filteredData}
            onEachFeature={onEachFeature}
            key={JSON.stringify(filteredData.features)}
          />
        )}
      </MapContainer>

      <div className="search-bar mt-3">
        <Form onSubmit={handleSearchSubmit}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by team name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form>
        {searchTerm && searchResults.length > 0 && (
          <ListGroup className="search-results">
            {searchResults.map((feature, index) => (
              <ListGroup.Item key={index} action onClick={() => handleSearchSelect(feature)}>
                {feature.properties.team} - {feature.properties.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      <StadiumModal show={!!modalData} onHide={() => setModalData(null)} data={modalData} />
    </div>
  );
};

export default Map;

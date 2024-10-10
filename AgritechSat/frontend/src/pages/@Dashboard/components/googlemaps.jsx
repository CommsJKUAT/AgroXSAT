import React, { useEffect, useState } from "react";
import axios from "axios";

const GoogleMapComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [polygonPath, setPolygonPath] = useState([]);

  const customMarkerIcon = {
    url: "/GSimage.jpg",
    scaledSize: new window.google.maps.Size(50, 50),
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/mapgs/");
        const { latitude, longitude } = response.data;
        setCoordinates({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      initMap();
    }
  }, [coordinates]);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      zoom: 13,
    });

    setMap(mapInstance);

    // Add a custom marker at the fetched coordinates
    new window.google.maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map: mapInstance,
      icon: customMarkerIcon,
    });

    // Create a new polygon
    const newPolygon = new window.google.maps.Polygon({
      paths: [], // Start with an empty path
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: mapInstance,
    });

    setPolygon(newPolygon);

    // Add click listener to the map to create the polygon
    mapInstance.addListener("click", (event) => {
      addLatLng(event.latLng);
    });
  };

  const addLatLng = (latLng) => {
    // Update polygon path with new point
    const path = [...polygonPath, latLng];
    setPolygonPath(path); // Update the state

    // Check if the polygon exists
    if (polygon) {
      polygon.setPath(path); // Update existing polygon path
    }
  };

  const clearPolygon = () => {
    if (polygon) {
      polygon.setMap(null); // Remove the polygon from the map
    }
    setPolygonPath([]); // Reset the polygon path
    setPolygon(null); // Clear the polygon state
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      <button onClick={clearPolygon}>Clear Polygon</button>
    </div>
  );
};

export default GoogleMapComponent;

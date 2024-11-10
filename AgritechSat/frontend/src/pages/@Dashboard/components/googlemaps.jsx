import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [secondCoordinates, setSecondCoordinates] = useState({ latitude: null, longitude: null });
  const [radius, setRadius] = useState(1000); // default radius
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/");
        const { latitude, longitude } = response.data;
        setCoordinates({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    const fetchSecondCoordinates = async () => {
      try {
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/");
        const { latitude, longitude } = response.data;
        setSecondCoordinates({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching second coordinates:", error);
      }
    };

    fetchCoordinates();
    fetchSecondCoordinates();
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude && secondCoordinates.latitude && secondCoordinates.longitude) {
      initMap();
    }
  }, [coordinates, secondCoordinates]);

  const initMap = () => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
    });

    setMap(map); // Store the map instance

    // Marker for Ground Station
    const markerElement = document.createElement("div");
    markerElement.style.backgroundImage = "url('/GSimage.jpg')";
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.backgroundSize = "contain";

    new mapboxgl.Marker(markerElement)
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .addTo(map);

    // Marker for Second Location (Satellite)
    const secondMarkerElement = document.createElement("div");
    secondMarkerElement.style.backgroundImage = "url('/cubesat.jpg')";
    secondMarkerElement.style.width = "30px";
    secondMarkerElement.style.height = "30px";
    secondMarkerElement.style.backgroundSize = "contain";

    const secondMarker = new mapboxgl.Marker(secondMarkerElement)
      .setLngLat([secondCoordinates.longitude, secondCoordinates.latitude])
      .addTo(map);

    // Popup for Ground Station
    const popup = new mapboxgl.Popup({ offset: 25 }).setText("The Ground Station");
    markerElement.addEventListener("mouseover", () => {
      popup.setLngLat([coordinates.longitude, coordinates.latitude]).addTo(map);
    });
    markerElement.addEventListener("mouseout", () => {
      popup.remove();
    });

    // Popup for Second Marker (Satellite)
    const secondPopup = new mapboxgl.Popup({ offset: 25 }).setText("Satellite");
    secondMarkerElement.addEventListener("mouseover", () => {
      secondPopup.setLngLat([secondCoordinates.longitude, secondCoordinates.latitude]).addTo(map);
    });
    secondMarkerElement.addEventListener("mouseout", () => {
      secondPopup.remove();
    });

    // Draw Circle using Turf.js
    map.on("load", () => {
      const center = [coordinates.longitude, coordinates.latitude];
      const circle = turf.circle(center, radius / 1000, { units: "kilometers" });

      map.addSource("circle", { type: "geojson", data: circle });
      map.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circle",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.35,
        },
      });
    });
  };

  // Function to handle radius change and update the circle
  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);

    if (map) {
      const center = [coordinates.longitude, coordinates.latitude];
      const updatedCircle = turf.circle(center, newRadius / 1000, { units: "kilometers" });
      
      // Update the circle source data
      map.getSource("circle").setData(updatedCircle);
    }
  };

  if (!coordinates.latitude || !coordinates.longitude || !secondCoordinates.latitude || !secondCoordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div id="map" style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Input for radius - Always visible */}
      <div
        className="radius-input"
        style={{
          position: "absolute",
          top: "20px", // Adjusted for visibility
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <input
          type="number"
          value={radius}
          onChange={(e) => handleRadiusChange(e.target.value)}
          min={100}
          max={5000}
          step={100}
          style={{ padding: "5px", fontSize: "14px", width: "150px" }}
        />
      </div>
    </div>
  );
};

export default MapboxComponent;

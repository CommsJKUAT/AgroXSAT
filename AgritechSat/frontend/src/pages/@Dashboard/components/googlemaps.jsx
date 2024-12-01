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
  const [secondMarker, setSecondMarker] = useState(null); // Store second marker instance
  const [coordinatesHistory, setCoordinatesHistory] = useState([]); // Store the history of second coordinates

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
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/satLocation/");
        const { latitude, longitude } = response.data;
        setSecondCoordinates({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching second coordinates:", error);
      }
    };

    // Fetch initial coordinates
    fetchCoordinates();
    fetchSecondCoordinates();

    // Set an interval to fetch new coordinates every minute
    const intervalId = setInterval(() => {
      fetchCoordinates();
      fetchSecondCoordinates();
    }, 60000); // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude && secondCoordinates.latitude && secondCoordinates.longitude) {
      initMap();
    }
  }, [coordinates, secondCoordinates]); // Only runs once both coordinates are available

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

    const marker = new mapboxgl.Marker(secondMarkerElement)
      .setLngLat([secondCoordinates.longitude, secondCoordinates.latitude])
      .addTo(map);

    setSecondMarker(marker); // Save reference to second marker

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

  // Update the second marker and draw the trajectory line
  useEffect(() => {
    if (secondMarker && secondCoordinates.latitude && secondCoordinates.longitude) {
      // Update the second marker's position
      secondMarker.setLngLat([secondCoordinates.longitude, secondCoordinates.latitude]);

      // Add the new coordinate to the coordinates history
      const updatedCoordinatesHistory = [...coordinatesHistory, secondCoordinates];
      setCoordinatesHistory(updatedCoordinatesHistory);

      // Draw the line representing the trajectory of the satellite
      const line = turf.lineString(updatedCoordinatesHistory.map(coord => [coord.longitude, coord.latitude]));

      // Update the line on the map (or add it if it doesn't exist)
      if (map.getSource("line-source")) {
        map.getSource("line-source").setData(line);
      } else {
        map.addSource("line-source", { type: "geojson", data: line });
        map.addLayer({
          id: "line-layer",
          type: "line",
          source: "line-source",
          paint: {
            "line-color": "#00FF00", // Green line
            "line-width": 3,
          },
        });
      }
    }
  }, [secondCoordinates]); // Runs every time secondCoordinates are updated

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

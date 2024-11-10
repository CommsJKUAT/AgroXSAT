import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
console.log("Mapbox Access Token:", import.meta.env.VITE_MAPBOX_TOKEN);
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [secondMarkerCoordinates, setSecondMarkerCoordinates] = useState({ latitude: null, longitude: null });
  const [circleRadius, setCircleRadius] = useState(1000); // Default radius in meters
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Fetch first coordinates
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/");
        const { latitude, longitude } = response.data;
        setCoordinates({ latitude, longitude });

        // Fetch second marker coordinates from a different API
        const secondResponse = await axios.get("https://agroxsat.onrender.com/backendapi/");
        const { latitude: secondLat, longitude: secondLng } = secondResponse.data;
        setSecondMarkerCoordinates({ latitude: secondLat, longitude: secondLng });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
    const intervalId = setInterval(fetchCoordinates, 5000); // fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      initMap();
    }
  }, [coordinates]);

  const initMap = () => {
    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
    });
    setMap(newMap);

    // Marker for Ground Station
    const groundStationMarkerElement = document.createElement("div");
    groundStationMarkerElement.style.backgroundImage = "url('/GSimage.jpg')";
    groundStationMarkerElement.style.width = "50px";
    groundStationMarkerElement.style.height = "50px";
    groundStationMarkerElement.style.backgroundSize = "contain";

    new mapboxgl.Marker(groundStationMarkerElement)
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .addTo(newMap);

    // Second marker for dynamic position
    const dynamicMarkerElement = document.createElement("div");
    dynamicMarkerElement.style.backgroundImage = "url('/dynamicMarker.jpg')";
    dynamicMarkerElement.style.width = "40px";
    dynamicMarkerElement.style.height = "40px";
    dynamicMarkerElement.style.backgroundSize = "contain";

    const dynamicMarker = new mapboxgl.Marker(dynamicMarkerElement)
      .setLngLat([secondMarkerCoordinates.longitude, secondMarkerCoordinates.latitude])
      .addTo(newMap);

    // Draw initial circle
    drawCircle(newMap, coordinates.longitude, coordinates.latitude, circleRadius);
  };

  const drawCircle = (mapInstance, longitude, latitude, radius) => {
    const center = [longitude, latitude];
    const circle = turf.circle(center, radius / 1000, { units: "kilometers" });

    if (mapInstance.getSource("circle")) {
      mapInstance.getSource("circle").setData(circle);
    } else {
      mapInstance.addSource("circle", { type: "geojson", data: circle });
      mapInstance.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circle",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.35,
        },
      });
    }
  };

  useEffect(() => {
    if (map && coordinates.latitude && coordinates.longitude) {
      drawCircle(map, coordinates.longitude, coordinates.latitude, circleRadius);
    }
  }, [circleRadius, map, coordinates]);

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value) || 1000; // Default to 1000 if input is invalid
    setCircleRadius(newRadius);
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "80vh" }}></div>
      <div style={{ marginTop: "10px" }}>
        <label>Circle Radius (meters): </label>
        <input
          type="number"
          value={circleRadius}
          onChange={handleRadiusChange}
          placeholder="Enter radius in meters"
        />
      </div>
    </div>
  );
};

export default MapboxComponent;

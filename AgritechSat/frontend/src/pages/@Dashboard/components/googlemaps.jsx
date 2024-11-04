import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

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

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      initMap();
    }
  }, [coordinates]);

  const initMap = () => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
    });

    // Marker for Ground Station
    const markerElement = document.createElement("div");
    markerElement.style.backgroundImage = "url('/GSimage.jpg')";
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.backgroundSize = "contain";

    new mapboxgl.Marker(markerElement)
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .addTo(map);

    // Popup for Ground Station
    const popup = new mapboxgl.Popup({ offset: 25 }).setText("The Ground Station");
    markerElement.addEventListener("mouseover", () => {
      popup.setLngLat([coordinates.longitude, coordinates.latitude]).addTo(map);
    });
    markerElement.addEventListener("mouseout", () => {
      popup.remove();
    });

    // Draw Circle using Turf.js
    map.on("load", () => {
      const center = [coordinates.longitude, coordinates.latitude];
      const circleRadius = 1000; // radius in meters
      const circle = turf.circle(center, circleRadius / 1000, { units: "kilometers" });

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

      // Update circle radius on zoom
      map.on("zoom", () => {
        const zoomLevel = map.getZoom();
        const adjustedRadius = zoomLevel < 14 ? 500 : 1000;
        const updatedCircle = turf.circle(center, adjustedRadius / 1000, { units: "kilometers" });
        map.getSource("circle").setData(updatedCircle);
      });
    });
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default MapboxComponent;

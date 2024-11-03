import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapboxComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // Fetch coordinates from your backend API
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
    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
    });

    // Add a custom marker
    const markerElement = document.createElement("div");
    markerElement.style.backgroundImage = "url('/GSimage.jpg')";
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.backgroundSize = "contain";

    new mapboxgl.Marker(markerElement)
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .addTo(map);

    // Create a popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setText("The Ground Station");

    // Add the popup to the marker
    markerElement.addEventListener("mouseover", () => {
      popup.setLngLat([coordinates.longitude, coordinates.latitude]).addTo(map);
    });
    markerElement.addEventListener("mouseout", () => {
      popup.remove();
    });

    // Draw a circle using GeoJSON
    map.on("load", () => {
      map.addSource("circle", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [coordinates.longitude, coordinates.latitude],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "circle-fill",
        type: "circle",
        source: "circle",
        paint: {
          "circle-radius": {
            stops: [
              [13, 1000 / 2], // adjust radius according to zoom
              [15, 1000],     // radius in meters
            ],
          },
          "circle-color": "#FF0000",
          "circle-opacity": 0.35,
        },
      });
    });
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default MapboxComponent;
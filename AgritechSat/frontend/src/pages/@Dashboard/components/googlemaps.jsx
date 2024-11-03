import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";

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

  const metersToPixels = (meters, zoom) => {
    const metersPerPixel = 156543.04 / Math.pow(2, zoom);
    return meters / metersPerPixel; // Convert meters to pixels
  };

  const initMap = () => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
    });

    // Create a custom marker
    const markerElement = document.createElement("div");
    markerElement.style.backgroundImage = "url('/GSimage.jpg')"; // Ensure this path is correct
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.backgroundSize = "contain";
    markerElement.style.backgroundRepeat = "no-repeat"; // Prevents image from repeating
    markerElement.style.backgroundPosition = "center"; // Centers the image

    // Ensure the map loads before adding the marker
    map.on("load", () => {
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

      // Add GeoJSON circle
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

      // Use the zoom event to update the circle radius
      const updateCircleRadius = () => {
        const zoom = map.getZoom();
        const radiusInMeters = 1000; // 1000 meters radius
        const radiusInPixels = metersToPixels(radiusInMeters, zoom);

        if (map.getLayer("circle-fill")) {
          map.setPaintProperty("circle-fill", "circle-radius", radiusInPixels);
        } else {
          map.addLayer({
            id: "circle-fill",
            type: "circle",
            source: "circle",
            paint: {
              "circle-radius": radiusInPixels,
              "circle-color": "#FF0000",
              "circle-opacity": 0.35,
            },
          });
        }
      };

      // Initial circle radius setting
      updateCircleRadius();

      // Update circle radius on zoom
      map.on("zoom", updateCircleRadius);
      map.on("moveend", updateCircleRadius); // Also update when the map is moved
    });
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default MapboxComponent;

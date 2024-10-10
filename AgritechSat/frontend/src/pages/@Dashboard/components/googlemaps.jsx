import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch coordinates from your backend API
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get("https://agroxsat.onrender.com/backendapi/mapgs/"); // Replace with your actual API endpoint
        const { latitude, longitude } = response.data;
        setCoordinates({ latitude, longitude });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Failed to fetch coordinates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (loading || error) return; // Prevent map rendering if still loading or there's an error

    if (coordinates.latitude && coordinates.longitude) {
      const { latitude, longitude } = coordinates;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 13,
      });

      // Custom marker icon URL
      const customMarkerIcon = {
        url: "/GSimage.jpg", // Replace with your custom marker URL
        scaledSize: new window.google.maps.Size(50, 50), // Adjust size if necessary
      };

      // Create a marker for the fetched coordinates
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        icon: customMarkerIcon, // Use custom icon
      });
    }
  }, [coordinates, loading, error]);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={mapRef}></div>
  );
};

export default GoogleMapComponent;

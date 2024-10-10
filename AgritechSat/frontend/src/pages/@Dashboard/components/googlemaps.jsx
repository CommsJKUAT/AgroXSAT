import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; // For making API calls

const GoogleMapComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch coordinates from your backend API
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
      // Dynamically load the Google Maps script
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      window.document.body.appendChild(googleMapScript);

      // Initialize the map once the script has loaded
      googleMapScript.addEventListener('load', () => {
        initMap();
      });

      // Function to initialize the map and set custom marker
      const initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: coordinates.latitude, lng: coordinates.longitude },
          zoom: 13,
        });

        // Use AdvancedMarkerElement for custom markers
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: coordinates.latitude, lng: coordinates.longitude },
          map: map,
          content: `<div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                      <img src="/GSimage.jpg" alt="Custom Marker" style="width: 30px; height: 30px;" />
                    </div>`,
        });

        // Optional: Set the marker to always be visible
        marker.setMap(map);
      };
    }
  }, [coordinates]);

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* This div will contain the Google Map */}
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default GoogleMapComponent;

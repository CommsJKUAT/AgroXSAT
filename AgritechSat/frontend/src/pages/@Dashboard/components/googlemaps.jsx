import React, { useEffect, useState } from "react";
import axios from "axios";

const GoogleMapComponent = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

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
      initMap();
    }
  }, [coordinates]);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      zoom: 13,
    });

    const customMarkerIcon = {
      url: "/GSimage.jpg",
      scaledSize: new window.google.maps.Size(50, 50),
    };

    const marker = new window.google.maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map: map,
      icon: customMarkerIcon,
    });

    // Create a circle with a 3km radius
    const circle = new window.google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      radius: 1000, // Radius in meters (3 km)
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: "<div style='color: black;'>The Ground Station</div>",
    });

    // Show the InfoWindow on mouseover and hide it on mouseout
    marker.addListener("mouseover", () => {
      infoWindow.open(map, marker);
    });

    marker.addListener("mouseout", () => {
      infoWindow.close();
    });
  };

  if (!coordinates.latitude || !coordinates.longitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div id="map" style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default GoogleMapComponent;

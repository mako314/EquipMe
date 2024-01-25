import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";

// const google = console.google;
const GOOGLE_MAPS_API_KEY = "INSERT KEY HERE";

function EquipmentMap({ location }) {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
  const [userLocation, setUserLocation] = useState({})


  // Upon load, this function gets the users current location and stores it as a value 'User Location'
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      // console.log("Geolocation not supported");
    }
  }

  // Helper function for successful location request
  function success(position) {
    // console.log(position)
    const lat = parseFloat(position.coords.latitude);
    const lng = parseFloat(position.coords.longitude);
    setUserLocation({ lat, lng });
    // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  }

  // Helper function for unsuccessful location request
  function error(error) {
    // console.log(error)
    // console.log("Unable to retrieve your location");
  }

  // JS API loader for Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })


  useEffect(() => {
    const fetchCoords = async () => {
      if (!location || !isLoaded) return;
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`);
        // console.log(response)
        const data = await response.json()
        // console.log(data)
        if (data.results && data.results.length > 0) {
          const temp = data.results[0].geometry.location
          // console.log(temp)
          setCoords(temp)
        } else {
          throw new Error('Invalid City Name');
        }
      } catch (error) {
        // console.error(error.message);
        setCoords({ lat: 0, lng: 0 })
        throw new Error(`Error fetching data from Geocoding API`)
      }
    }
    // Convert city into lat/lng coords, then get user location all asynchronously
    fetchCoords();
    getCurrentLocation()

  }, [location])

  // Ensure map is loaded into the jsApiLoader before continuing
  if (!isLoaded) {
    // console.log("No Map Loaded")
    return;
  }

  // console.log(userLocation)


  // Returns a Google Map centered at the equipment location, a radius illustrating where the owner
  // can deliver equipment, and another Marker for the user's location so they can determine if they are
  // in delivery range or not - Delivery radius automatically set to 50,000 meters
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMap
        center={coords}
        zoom={9}
        mapContainerStyle={{ width: "100%", height: "100%" }}>

        <Marker position={userLocation} />
        <Circle center={coords} radius={50000} />

      </GoogleMap>
    </div>
  )

}

export default EquipmentMap;


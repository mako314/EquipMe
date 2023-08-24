import { Loader } from "@googlemaps/js-api-loader"
import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";

class EquipmentMap extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4XiBrjLrOVLC66GfucEFBpTggxZLj-SE&v=weekly`; // Replace YOUR_API_KEY
    script.async = true;
    script.onload = this.initMap;
    document.head.appendChild(script);
  }

  initMap = () => {
    // The Google Maps API is now loaded and you can initialize your map here
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  };

  render() {
    return <div id="map" style={{ width: '100%', height: '500px' }}>


    </div>;
  }
}

export default EquipmentMap;

import React, { Component } from 'react';

class EquipmentMap extends Component {
  map = null; // Reference to the map instance

  componentDidMount() {
    this.loadGoogleMapsScript();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.loadMap();
    }
  }

  componentWillUnmount() {
    // Unload the map and clean up resources
    if (this.map) {
      this.map = null;
    }
  }

  loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4XiBrjLrOVLC66GfucEFBpTggxZLj-SE&v=weekly&callback=initMap`;
      script.async = true;
      script.onload = this.loadMap;
      document.head.appendChild(script);
    } else {
      this.loadMap();
    }
  };

  loadMap = () => {
    if (this.props.location) {
      const geocoder = new window.google.maps.Geocoder();
      const mapOptions = {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 },
      };

      if (!this.map) {
        this.map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
      }

      this.codeAddress(geocoder, this.map, this.props.location);
    }
  };

  codeAddress = (geocoder, map, address) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        new window.google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  };

  render() {
    return (
        <div className="map-container">
          <div id="map" style={{ height: '500px' }}></div>
        </div>
      );
  }
}

export default EquipmentMap;


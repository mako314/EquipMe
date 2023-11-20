import React, { Component } from 'react'

class EquipmentMap extends Component {

  map = null // Reference to the map instance

  componentDidMount() {
    // If comomponent mounted, load the map
    this.loadGoogleMapsScript()
  }

  componentDidUpdate(prevProps) {
    //Upon component upload, this fires off, allowing the location to update and the map to be used
    if (prevProps.location !== this.props.location) {
      this.loadMap()
    }
  }

  componentWillUnmount() {
    // Unload the map and clean up resources
    if (this.map) {
      this.map = null
    }
  }
  
  loadGoogleMapsScript = () => {
    if (!window.google && document.getElementById('map')) {
      const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY
      const script = document.createElement('script')
      script.setAttribute("id", "mapScript")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&v=weekly&callback=initMap`
      script.async = true
      script.onload = this.loadMap
      document.head.appendChild(script)

      script.onload = () => {
        this.loadMap() // Load map once script is loaded. Was having issues with it not existing basically upon first load 
      }
    } else {
      this.loadMap() // Load map if script already present
    }
  }

  loadMap = () => {
    //Only load map once element with id of map exists
    if (this.props.location && document.getElementById('mapScript')) {
      const geocoder = new window.google.maps.Geocoder()
      const mapOptions = {
        zoom: 12,
        center: { lat: -34.397, lng: 150.644 },
      }

      if (!this.map) {
        this.map = new window.google.maps.Map(document.getElementById('map'), mapOptions)
      }

      this.codeAddress(geocoder, this.map, this.props.location)
    }
  }

  codeAddress = (geocoder, map, address) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location)
        new window.google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        })
      } else {
        console.error('Geocode was not successful for the following reason:', status)
      }
    })
  }

  render() {
    return (
        // <div className="map-container">
          <div id="map" style={{ height: '500px', width:'550px'}}></div>
        // </div>
      )
  }
}

export default EquipmentMap;
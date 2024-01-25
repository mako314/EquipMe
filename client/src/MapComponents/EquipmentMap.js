import React, { Component } from 'react'

class EquipmentMap extends Component {

  map = null // Reference to the map instance

  // componentDidMount() {
  //   // If comomponent mounted, load the map
  //   this.loadGoogleMapsScript()
  // }
  componentDidMount() {
    // If the window doesn't have it, load the script. If it does, just continue and load the map
    if (!window.google) {
      this.loadGoogleMapsScript()
    } else {
      this.loadMap()
    }
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
    // if (!window.google && document.getElementById('map')) {
      const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY
      const script = document.createElement('script')
      script.setAttribute("id", "mapScript")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&v=weekly&callback=initMap`
      script.async = true
      document.head.appendChild(script)
      // script.onload = this.loadMap
  
      // script.onload = () => {
      //   this.loadMap() // Load map once script is loaded. Was having issues with it not existing basically upon first load 
      // }
      window.initMap = this.loadMap
      // } else {
      //   this.loadMap() // Load map if script already present
      // }
  }

  loadMap = () => {
    // If the window hasn't loaded yet, console log an error
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API is not loaded yet.')
      return
    }
    // console.log("Beep boop", )
    //Only load map once element with id of map exists
    const mapDiv = document.getElementById('map')
    if (this.props.location && mapDiv) {
      const geocoder = new window.google.maps.Geocoder()
      const mapOptions = {
        zoom: this.props.userDisplayZoom ? this.props.userDisplayZoom : 12,
        center: { lat: -34.397, lng: 150.644 },
      }
      if (mapDiv && !this.map) {
        this.map = new window.google.maps.Map(document.getElementById('map'), mapOptions)
      }
      if (this.map) {
      this.codeAddress(geocoder, this.map, this.props.location)
      }
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
        // console.error('Geocode was not successful for the following reason:', status)
      }
    })
  }

  

  render() {
    return (
        // <div className="map-container">
          <div id="map" style={{ height: this.props.userDisplayHeight ? this.props.userDisplayHeight :'500px',  width: this.props.userDisplayWidth ? this.props.userDisplayWidth : '550px'}}></div>
        // </div>
      )
  }
}

export default EquipmentMap;
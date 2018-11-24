import React from 'react';
import {
  withGoogleMap, GoogleMap, Marker, withScriptjs,
} from 'react-google-maps';

const MapComponent = withScriptjs(withGoogleMap(props => <GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: 3.371, lng: 6.509 }}
  >
    {props.chilren}
    <Marker position={{ lat: 3.371, lng: 6.509 }} />
  </GoogleMap>));

export default MapComponent;

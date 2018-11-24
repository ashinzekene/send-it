import React from 'react';
import {
  withGoogleMap, GoogleMap, Marker, withScriptjs,
} from 'react-google-maps';

const MapComponent = withScriptjs(withGoogleMap(props => <GoogleMap
    defaultZoom={17}
    defaultCenter={{ lat: 6.5538, lng: 3.3665 }}
    center={props.location}
  >
    {props.chilren}
    <Marker
      draggable={props.draggable}
      onDragEnd={props.onDragEnd}
      position={props.location}
    />
  </GoogleMap>));

export default MapComponent;

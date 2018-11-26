import React from 'react';
import {
  withGoogleMap, GoogleMap, Marker, withScriptjs,
} from 'react-google-maps';

const MapComponent = withScriptjs(withGoogleMap(props => <GoogleMap
    defaultZoom={17}
    defaultCenter={{ lat: 6.5538, lng: 3.3665 }}
    center={props.location}
  >
    {props.children}
    <Marker
      draggable={props.markerDraggable}
      onDragEnd={props.onMarkerDragEnd}
      position={props.location}
    />
  </GoogleMap>));

export default MapComponent;

import React, { Component } from 'react';
import { GoogleApiWrapper, Map } from 'google-maps-react';
import { Marker } from 'google-maps-react/dist/components/Marker';
import { InfoWindow } from 'google-maps-react/dist/components/InfoWindow';

const GOOGLE_API_KEY = 'AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY';

export class MapContainer extends Component {
  render() {
    return (
      <Map google={this.props.google} initalCenter={{}} zoom={14}>
        <Marker onClick={this.onMarkerClick} name={'Current location'} />
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>Map</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY,
})(MapContainer);

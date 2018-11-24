import React, { Component } from 'react';
import api from '../api';
import MapComponent from '../components/CreateParcelMap';

export default class Parcel extends Component {
  state = {
    parcel: null,
    error: false,
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      console.log(await api.getPlace('lagos'));
      const { data: parcel } = await api.get(`/parcels/${id}`);
      this.setState({ parcel: parcel[0] });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  render() {
    const { parcel } = this.state;
    return (
      <div className="parcel-page d-flex flex-wrap page">
        <MapComponent
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div className="col-md-6 col-sm-12 p-0" />}
          mapElement={<div className="h-100" />}
        />
        <div className="single-parcel col-md-6 col-sm-12">
          {this.state.parcel === null ? <div>Loading...</div>
            : <div className="parcel">
            <div className="locations d-flex">
              <h3>{ parcel.from }</h3>
              <h3>&rarr;</h3>
              <h3>{ parcel.to }</h3>
            </div>
            <div className="status">{parcel.currentlocation}</div>
            <div className="status label">{parcel.status}</div>
            <div className="date">Date: {(new Date(parcel.senton)).toDateString()}</div>
            </div>
          }
        </div>
      </div>
    );
  }
}

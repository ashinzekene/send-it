import React, { Component } from 'react';
import { Polyline } from 'react-google-maps';
import api from '../api';
import MapComponent from '../components/CreateParcelMap';


export default class Parcel extends Component {
  state = {
    parcel: null,
    error: false,
    location: { lat: 6.5538, lng: 3.3665 },
    path: [],
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      const { data: parcel } = await api.get(`/parcels/${id}`);
      this.setState({ parcel: parcel[0] });
      this.getLocations();
      this.getDistanceMetrics();
    } catch (err) {
      this.setState({ error: true });
    }
  }

  getDistanceMetrics = async () => {
    const { from, to } = this.state.parcel;
    console.log(await api.getDistance(from, to));
  }

  getLocations = async () => {
    const { from, to } = this.state.parcel;
    const results = await Promise.all([from, to].map(api.getPlace));
    const path = results.map(({ results: res }) => res[0].geometry.location);
    this.setState({ location: path[0] });
    this.setState({ path });
  }

  handleChange = type => ({ target }) => {
    this.setState({ [type]: target.value });
  }

  handleDragEnd = () => {

  }


  render() {
    const { parcel, path } = this.state;
    return (
      <div className="parcel-page d-flex flex-wrap page">
        <MapComponent
          location={this.state.location}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div className="col-md-6 col-sm-12 p-0" style={{ minHeight: '400px' }} />}
          mapElement={<div className="h-100" />}
          >
            { path.length > 1 && <Polyline
              geodesic={true}
              strokeColor="#FF0000"
              strokeOpacity={1.0}
              strokeWeight={3}
              path={path}
              />}
          </MapComponent>
        <div className="single-parcel col-md-6 col-sm-12">
          {this.state.parcel === null ? <div>Loading...</div>
            : <div className="parcel">
            <div className="locations d-flex row">
              <h3 className="col-md-5 col-sm-12">{ parcel.from }</h3>
              <h3 className="col-md-2 col-sm-12">&rarr;</h3>
              <h3 className="col-md-5 col-sm-12">{ parcel.to }</h3>
            </div>
            <div className="status">{parcel.currentlocation}</div>
            <div className="badge badge-primary">{parcel.status}</div>
            <div className="date">Date: {(new Date(parcel.senton)).toDateString()}</div>
            <select className="custom-select">
              <option onChange={this.handleChange('status')} value="">Change status</option>
              <option value="placed">Placed</option>
              <option value="transiting">Transiting</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-block my-4 py-3">Change current location</button>
            <button className="btn btn-block my-4 py-3">Change destination</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

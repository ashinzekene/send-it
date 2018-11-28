import React, { Component } from 'react';
import { Polyline } from 'react-google-maps';
import api from '../api';
import MapComponent from '../components/CreateParcelMap';
import CloseButton from '../components/CloseButton';

export default class Parcel extends Component {
  state = {
    parcel: null,
    error: false,
    location: { lat: 6.5538, lng: 3.3665 },
    path: [],
    message: '',
    destination: '',
    currentlocation: '',
    isAdmin: false,
  }

  async componentDidMount() {
    this.setState({ isAdmin: !!(+this.props.user.isAdmin) });
    this.getParcel();
  }

  getParcel = async () => {
    const { id } = this.props;
    try {
      const { data: parcel } = await api.get(`/parcels/${id}`);
      this.setState({
        parcel: parcel[0],
        currentlocation: parcel[0].currentlocation,
        newDestination: parcel[0].to,
      });
      this.getLocations();
      this.getDistanceMetrics();
    } catch (err) {
      this.setState({ error: 'A network error occurred' });
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
    this.setState({ location: path[1] });
    this.setState({ path });
  }

  handleChange = type => ({ target }) => {
    this.setState({ [type]: target.value });
  }

  changeStatus = async ({ target }) => {
    this.setState({ error: false, message: false });
    try {
      const { error, status, message } = await api.patch(`/parcels/${this.props.id}/status`, { status: target.value });
      if (status !== 200) {
        this.setState({ error });
      } else {
        this.setState({ message });
        this.getParcel();
      }
    } catch (err) {
      this.setState({ error: 'A network error occurred' });
    }
  }

  searchLocation = type => async ({ target }) => {
    const { results } = await api.getPlace(target.value);
    if (results.length > 0) {
      this.setState({
        [type]: results[0].formatted_address,
      });
    }
  }

  removeAlert = () => this.setState({ error: false, message: false });

  update = async () => {
    const { to, currentlocation, isAdmin } = this.state;
    let body; let urlPath;
    if (isAdmin) {
      body = { currentlocation };
      urlPath = 'currentlocation';
    } else {
      body = { to };
      urlPath = 'destination';
    }
    try {
      const { data, error, status } = await api.patch(`/parcels/${this.props.id}/${urlPath}`, body);
      if (status === 200) {
        this.setState({ message: data.message });
      } else {
        this.setState({ error });
      }
      this.getParcel();
    } catch (error) {
      console.log({ error });
      this.setState({ error: error.message });
    }
  }

  render() {
    const {
      parcel, path, error, message, isAdmin,
    } = this.state;
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
        <div className="single-parcel col-md-6 p-4 col-sm-12">
          {this.state.parcel === null ? <div>Loading...</div>
            : <div className="parcel">
            { !!error && <div className="alert alert-danger">
              {error}
              <CloseButton onClick={this.removeAlert} />
              </div>
            }
            { !!message && <div className="alert alert-success">
              {message}
              <CloseButton onClick={this.removeAlert} />
              </div>
            }
            <div className="locations d-flex row">
              <h5 className="col-md-5 col-sm-12">{ parcel.from }</h5>
              <h5 className="col-md-2 col-sm-12">&rarr;</h5>
              <h5 className="col-md-5 col-sm-12">{ parcel.to }</h5>
            </div>
            <div className="parcel-details justify-content-between d-flex flex-wrap py-3">
              <div className="location w-100">Current Location: {parcel.currentlocation}</div>
              <div className="status">
                Status: {' '}
                <div className="badge px-3 py-2 badge-primary">{parcel.status}</div>
              </div>
              <div className="date">Date: {(new Date(parcel.senton)).toDateString()}</div>
            </div>
            <div className="edit-form pt-5">
              { isAdmin && <div className="form-group">
                <label htmlFor="to">Change Status</label>
                <select onChange={this.changeStatus} className="custom-select">
                  <option value="">Change status</option>
                  <option value="placed">Placed</option>
                  <option value="transiting">Transiting</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>}
              {!isAdmin && <div className="form-group">
                <label htmlFor="to">Destination</label>
                <input required type="text" placeholder="Change Destination" onChange={this.searchLocation('to')} className="form-control" id="to" />
                <div className="py-2">Location: {this.state.to}</div>
              </div>}
              {isAdmin && <div className="form-group">
                <label htmlFor="to">Current Location</label>
                <input required type="text" placeholder="Change Current Location" onChange={this.searchLocation('currentlocation')} className="form-control" id="to" />
                <div className="py-2">Location: {this.state.currentlocation}</div>
              </div>}
            </div>
            <button onClick={this.update} className="btn btn-success btn-block my-4">Save Changes</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { navigate } from '@reach/router/lib/history';
import './CreateParcel.css';
import api from '../api';
import MapComponent from '../components/CreateParcelMap';

export default class CreateParcel extends Component {
  state = {
    data: {},
    location: { lat: 6.5538, lng: 3.3665 },
  }

  handleChange = x => (e) => {
    this.setState(({ data }) => ({ data: { ...data, [x]: e.target.value } }));
    e.persist();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { status, error } = await api.post('/parcels', this.state.data);
    if (status === 200) {
      navigate('/parcels');
    } else {
      console.log(error);
    }
  }

  searchLocation = type => async (event) => {
    const { value } = event.currentTarget;
    let t;
    if (value) {
      const { results } = await api.getPlace(value);
      console.log(results);
      if (results.length > 0) {
        clearTimeout(t);
        t = setTimeout(() => {
          this.setState(({ data }) => ({
            location: results[0].geometry.location,
            data: { ...data, [type]: results[0].formatted_address },
          }));
        }, 600);
      } else {
        console.log('Not found', results);
      }
    }
    event.persist();
  }

  render() {
    return (
      <div className="d-flex row align-items-stretch create-parcel page">
        <form className="p-4 col-md-6 col-sm-12" onSubmit={ this.handleSubmit }>
          <h3 className="py-4">Create a parcel...</h3>
          <div className="form-group mb-1">
            <label htmlFor="from">From</label>
            <input required type="text" onChange={this.searchLocation('from')} className="form-control" id="from" />
          </div>
          <div className="py-2">Location: {this.state.data.from}</div>
          <div className="form-group mb-1 mt-3">
            <label htmlFor="to">Destination</label>
            <input required type="text" onChange={this.searchLocation('to')} className="form-control" id="to" />
          </div>
          <div className="py-2">Location: {this.state.data.to}</div>
          <div className="form-group mt-3">
            <label htmlFor="weight">Size of Good (kg)</label>
            <input required type="number" onChange={this.handleChange('weight')} value={this.state.weight} className="form-control" id="weight" />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Parcel
          </button>
        </form>
        <MapComponent
          location={this.state.location}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div className="col-md-6 col-sm-12 p-0" style={{ minHeight: '400px' }} />}
          mapElement={<div className="h-100" />}/>
      </div>
    );
  }
}
